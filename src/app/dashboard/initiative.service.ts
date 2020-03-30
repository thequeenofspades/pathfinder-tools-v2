import { Injectable } from '@angular/core';
import { Subject, Observable, of, from } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { randomColor } from 'randomcolor';

import { Monster, Creature } from './monster';
import { MessageService } from '../message.service';
import { Condition, CONDITIONS } from './condition';

export class Initiative {
  order: Creature[];
  active: number;
  round: number;
  playerOptions: PlayerOptions;
  buffs: Condition[];
  timestamp: number;
}

export class PlayerOptions {
  nameOption: string;
  healthOption: string;
  visibleOption: string;
}

export enum ShowNamesOption {
  NoShow = "Don't show",
  ShowNameOnly = "Show names",
  ShowNameAndNumber = "Show names and numbers"
}

const defaultPlayerOptions: PlayerOptions = {
  nameOption: ShowNamesOption.ShowNameAndNumber,
  healthOption: 'Detailed',
  visibleOption: 'invisible'
}

@Injectable({
  providedIn: 'root'
})
export class InitiativeService {

  constructor(private messageService: MessageService,
    private db: AngularFirestore) {
  }

  initDoc: AngularFirestoreDocument<any>;

  private init: Subject<Initiative> = new Subject<Initiative>();
  public init$: Observable<Initiative> = this.init.asObservable();

  private active = new Subject<Creature>();
  public active$ = this.active.asObservable();

  setup(sessionId: string): void {
    this.initDoc = this.db.collection('sessions').doc(sessionId);
    this.initDoc.ref.get().then(doc => {
      if (!doc.data().order) {
        this.initDoc.set({
          order: [],
          active: 0,
          buffs: [],
          round: 1,
          playerOptions: defaultPlayerOptions,
          timestamp: Date.now()});
      } else {
        this.initDoc.update({timestamp: Date.now()});
      }
    });
    this.refresh();
  }

  refresh(): void {
    this.initDoc.snapshotChanges().subscribe(a => {
      this.init.next(a.payload.data());
    });
  }

  reset(): void {
    this.initDoc.update({round: 1});
  }

  // Get a snapshot of the current Initiative, as an Observable.
  getInit(): Observable<Initiative> {
    return from(this.initDoc.ref.get()).pipe(take(1), map(doc => {
      return (doc.data() as Initiative);
    }));
  }

  getOrder(): Observable<Creature[]> {
    return this.init$.pipe(
      take(1),
      map(init => {
        return init.order ? init.order : [];
      })
    );
  }

  getPlayerOptions(): Observable<PlayerOptions> {
    return from(this.initDoc.ref.get()).pipe(
      take(1),
      map(doc => {
        return doc.data().playerOptions ? doc.data().playerOptions : defaultPlayerOptions;
      }));
  }

  updatePlayerOptions(options: PlayerOptions): void {
    this.initDoc.update({playerOptions: options}).then(_ => {
      this.messageService.add('Updated player view options');
    });
  }

  get(id: string): Observable<Creature> {
    return from(this.initDoc.ref.get()).pipe(
      map(doc => {
        let order = doc.data().order || [];
        return order.find(c => c.id == id);
      }));
  }

  add(creature: Creature, initiative: number = null): void {
    this.initDoc.ref.get().then(doc => {
      let order = doc.data().order || [];
      let playerOptions: PlayerOptions = doc.data().playerOptions || {}
      if (initiative == null) initiative = getRandomInt(1, 20) + creature.initiativeBonus;
      let creatureCopy = {
        ...JSON.parse(JSON.stringify(creature)),
        initiative: initiative,
        id: this.db.createId(),
        visible: (playerOptions.visibleOption == 'visible')
      };
      let insertIndex = order.findIndex(c => this.goesBefore(creatureCopy, c));
      if (insertIndex < 0) {
        insertIndex = order.length;
      }
      order = this.insertCreature(order, insertIndex, creatureCopy);
      this.initDoc.update({order: order}).then(_ => {
        this.messageService.add(`Added ${creature.name} to initiative order`);
      });
    });
  }

  addMultiple(creatures: Creature[]): void {
    if (creatures.length == 1) {
      return this.add(creatures[0]);
    }
    this.initDoc.ref.get().then(doc => {
      let order = doc.data().order || [];
      let playerOptions: PlayerOptions = doc.data().playerOptions || {}
      creatures.forEach((creature, i) => {
        let creatureCopy = {
          ...JSON.parse(JSON.stringify(creature)),
          initiative: getRandomInt(1, 20) + creature.initiativeBonus,
          id: this.db.createId(),
          visible: (playerOptions.visibleOption == 'visible')
        };
        let insertIndex = order.findIndex(c => this.goesBefore(creatureCopy, c));
        if (insertIndex < 0) insertIndex = order.length;
        order = this.insertCreature(order, insertIndex, creatureCopy);
      });
      this.initDoc.update({order: order}).then(_ => {
        this.messageService.add(`Added ${creatures.length} creatures to initiative order`);
      });
    });
  }

  remove(creature: Creature): void {
    this.initDoc.ref.get().then(doc => {
      let order = doc.data().order || [];
      let idx = order.findIndex(c => c.id == creature.id);
      let active = doc.data().active || 0;
      if (idx < active) active -= 1;
      order.splice(idx, 1);
      if (active >= order.length) active = 0;
      this.initDoc.update({order: order, active: active}).then(_ => {
        this.messageService.add(`Removed ${creature.name} from initiative order`);
      })
    });
  }

  clear(): void {
    this.initDoc.update({
      order: [],
      round: 1,
      active: 0
    }).then(_ => {
      this.messageService.add('Cleared initiative order');
    });
  }

  previous(): void {
    this.initDoc.ref.get().then(doc => {
      let active = (doc.data().active || 0) - 1;
      let order = (doc.data().order as Creature[]) || [];
      if (active < 0) {
        active = order.length - 1;
        this.initDoc.update({round: (doc.data().round || 1) - 1});
      }
      this.initDoc.update({active: active}).then(() => {
        this.active.next(order[active]);
      });
    });
  }

  advance(): void {
    this.initDoc.ref.get().then(doc => {
      let active = doc.data().active || 0;
      let order = (doc.data().order as Creature[]) || [];
      let buffs = doc.data().buffs || [];
      let round = doc.data().round || 1;
      let prev = (order[active] as any).initiative;
      active += 1;
      if (active >= order.length) {
        active = 0;
        round += 1;
      }
      let curr = (order[active] as any).initiative;
      buffs = this.updateBuffs(prev, curr, buffs);
      order[active].delayed = false;
      this.initDoc.update({active: active, order: order, round: round, buffs: buffs}).then(_ => {
        this.active.next(order[active]);
      });
    });
  }

  rerollInitiativeForAll(): void {
    this.initDoc.ref.get().then(doc => {
      let order : Creature[] = doc.data().order || [];
      let newOrder = [];
      order.forEach(creature => {
        creature.initiative = getRandomInt(1, 20) + creature.initiativeBonus;
        let idx = newOrder.findIndex(cr => cr.initiative <= creature.initiative);
        idx = idx == -1 ? newOrder.length : idx;
        this.insertCreature(newOrder, idx, creature);
      });
      this.initDoc.update({order: newOrder, active: 0}).then(_ => {
        this.active.next(newOrder[0]);
        this.messageService.add('Rerolled initiative for all creatures');
      });
    });
  }

  updateBuffs(prev: number, curr: number, buffs: Condition[]): {}[] {
    return buffs.map(buff => {
      if (buff.permanent) {
        return buff;
      }
      let duration = buff.duration;
      if (prev < curr && curr < buff.initiative) {  // we're at the top of a new round
        duration -= 1;
      } else if (prev > buff.initiative && curr <= buff.initiative) {
        duration -= 1;
      }
      let buffCopy = {
        ...buff,
        duration: duration
      };
      return buffCopy;
    }).filter(buff => {
      return buff.permanent || buff.duration > 0;
    });
  }

  insertCreature(order: Creature[], index: number, creature: Creature): Creature[] {
    // Insert creature at the given position in initiative, adjusting its
    // initiative value as necessary
    creature.initiative = this.getNewInitiative(order, index, creature.initiative);
    order.splice(index, 0, creature);
    return order;
  }

  moveUp(creature: Creature): void {
    this.initDoc.ref.get().then(doc => {
      let order = doc.data().order || [];
      let originalIdx: number = order.findIndex(c => c.id == creature.id);
      order.splice(originalIdx, 1);
      let newIdx: number = originalIdx - 1;
      if (originalIdx == 0) newIdx = order.length;
      order = this.insertCreature(order, newIdx, creature);
      this.initDoc.update({order: order});
    });
  }

  moveDown(creature: Creature): void {
    this.initDoc.ref.get().then(doc => {
      let order = doc.data().order || [];
      let originalIdx: number = order.findIndex(c => c.id == creature.id);
      order.splice(originalIdx, 1);
      let newIdx: number = originalIdx + 1;
      if (originalIdx == order.length) newIdx = 0;
      order = this.insertCreature(order, newIdx, creature);
      this.initDoc.update({order: order});
    });
  }

  delay(creature: Creature): void {
    this.initDoc.ref.get().then(doc => {
      let order = doc.data().order || [];
      let crIdx = order.findIndex(c => c.id == creature.id);
      order[crIdx].delayed = true;
      let active = doc.data().active || 0;
      let round = doc.data().round || 1;
      if (crIdx == active) {
        active += 1;
        if (active >= order.length) {
          active = 0;
          round += 1;
        }
      }
      this.initDoc.update({order: order, active: active, round: round}).then(_ => {
        this.messageService.add(`${creature.name} delayed`);
      });
    });
  }

  undelay(creature: Creature): void {
    this.initDoc.ref.get().then(doc => {
      let order = doc.data().order || [];
      let active = doc.data().active || 0;
      let crIdx = order.findIndex(c => c.id == creature.id);
      if (crIdx < active) active -= 1;
      creature.delayed = false;
      order.splice(crIdx, 1);
      let newIdx = active + 1;
      if (newIdx > order.length) newIdx = order.length;
      order = this.insertCreature(order, newIdx, creature);
      this.initDoc.update({order: order, active: active}).then(_ => {
        this.messageService.add(`${creature.name} undelayed`);
      });
    });
  }

  toggleVisible(creature: Creature): void {
    this.initDoc.ref.get().then(doc => {
      let order = doc.data().order || [];
      let cr = order.find(c => c.id == creature.id);
      cr.visible = !cr.visible;
      this.initDoc.update({order: order});
    })
  }

  toggleAllVisible(visible: boolean): void {
    this.initDoc.ref.get().then(doc => {
      let order = doc.data().order || [];
      for (let creature of order) {
        if (creature.hp) {
          creature.visible = visible;
        }
      }
      this.initDoc.update({order: order});
    });
  }

  update(creature: Creature): void {
    this.initDoc.ref.get().then(doc => {
      let order = (doc.data().order as Creature[]) || [];
      let crIdx = order.findIndex(c => c.id == creature.id);
      order[crIdx] = JSON.parse(JSON.stringify(creature));
      this.initDoc.update({order: order});
    });
  }

  damage(creature: Creature, amount: number): void {
    this.initDoc.ref.get().then(doc => {
      this.messageService.add(`${creature.name} took ${amount} damage`);
      let order = doc.data().order || [];
      let cr = order.find(c => c.id == creature.id);
      this.checkHpStatus((cr as Monster), amount);
      (cr as Monster).currentHp = (cr as Monster).currentHp - amount;
      this.initDoc.update({order: order});
    });
  }

  addBuff(buff: Condition): void {
    this.initDoc.ref.get().then(doc => {
      let buffs = doc.data().buffs || [];
      let buffCopy = {
        ...buff,
        id: this.db.createId(),
        color: randomColor({luminosity: 'light'})
      };
      buffs.push(buffCopy);
      this.initDoc.update({buffs: buffs});
    });
  }

  // Do not use this for updating multiple buffs due to synchronicity issues.
  // Use "updateMultipleBuffs()" instead.
  updateBuff(buff: Condition): void {
    this.initDoc.ref.get().then(doc => {
      let buffs = doc.data().buffs || [];
      let buffIdx = buffs.findIndex(b => b.id == buff.id);
      buffs[buffIdx] = buff;
      this.initDoc.update({buffs: buffs});
    });
  }

  // Replace all active buffs with a new list.
  updateMultipleBuffs(buffs: Condition[]): void {
    this.initDoc.update({buffs: buffs});
  }

  removeBuff(buff: Condition): void {
    this.initDoc.ref.get().then(doc => {
      let buffs = doc.data().buffs || [];
      buffs = buffs.filter(b => b.id != buff.id);
      this.initDoc.update({buffs: buffs});
    });
  }

  removeBuffFromCreature(buff: Condition, creature: Creature): void {
    buff.affected = buff.affected.filter(affected => {
      return affected.id != creature.id;
    });
    if (buff.affected.length == 0) {
      this.removeBuff(buff);
    } else {
      this.updateBuff(buff);
    }
  }

  clearBuffs(): void {
    this.initDoc.update({buffs: []});
  }

  changeBuffColor(buff: Condition): void {
    this.initDoc.ref.get().then(doc => {
      let buffs = doc.data().buffs || [];
      let buffIndex = buffs.findIndex(b => b.id == buff.id);
      buffs[buffIndex].color = randomColor();
      this.initDoc.update({buffs: buffs});
    });
  }

  // Check status of monster's health and return whether a new status was applied.
  checkHpStatus(monster: Monster, amount: number): boolean {
    let currentStatus = this.getCurrentStatus(monster, monster.currentHp);
    let newStatus = this.getCurrentStatus(monster, monster.currentHp - amount);

    // If nothing has changed, exit.
    if (currentStatus == newStatus) {
      return false;
    }

    this.initDoc.ref.get().then(doc => {
      let buffs = doc.data().buffs || [];

      if (newStatus == 'healthy') {
        this.messageService.add(`${monster.name} became healthy`);
      }
      if (newStatus == 'bloodied') {
        this.messageService.add(`${monster.name} became bloodied`);
      }
      if (newStatus == 'dead') {
        this.messageService.add(`${monster.name} died!`);
      }
      if (newStatus == 'dying') {
        this.messageService.add(`${monster.name} is dying!`);
      }
      if (newStatus == 'disabled') {
        this.messageService.add(`${monster.name} is at 0 hp and disabled`);
      }

      return this.applyStatusCondition(monster, buffs, newStatus);
    });    
  }

  // Get current status of monster's health.
  getCurrentStatus(monster: Monster, hp: number): string {
    if (hp <= -1 * monster.conScore) {
      return 'dead';
    } else if (hp < 0) {
      return 'dying';
    } else if (hp == 0) {
      return 'disabled';
    } else if (hp <= monster.hp / 2) {
      return 'bloodied';
    }
    return 'healthy';
  }

  // Apply the status condition to the monster and return whether a change was made successfully.
  // A status condition is permanent, invisible to players, and updates automatically based on the monster's health.
  applyStatusCondition(monster: Monster, conditions: Condition[], status: string): boolean {
    let shouldAddStatus = ['dead', 'dying', 'disabled'].includes(status);

    if (shouldAddStatus) {
      // If the status condition is already active, use it.
      let statusConditionIdx: number = conditions.findIndex(condition => {
        return condition.name == status && this.isStatusCondition(condition);
      });
      if (statusConditionIdx >= 0) {
        if (!conditions[statusConditionIdx].affected) {
          conditions[statusConditionIdx].affected = [];
        }
        // If monster is already in the list of affected, do nothing.
        if (conditions[statusConditionIdx].affected.findIndex(cr => {
          return cr.id == monster.id;
        }) < 0) {
          // Add monster to list of affected.
          conditions[statusConditionIdx].affected.push(monster);
        }
      } else {
        // Create new global status condition.
        let statusCondition: Condition = {
            id: this.db.createId(),
            name: status,
            permanent: true,
            description: CONDITIONS.find(c => c.name == status).description,
            affected: [monster],
            playerVisible: 0  // not visible to players
        };
        conditions.push(statusCondition);
      }
    }

    // Remove other statuses from this creature.
    conditions.forEach(condition => {
      if (this.isStatusCondition(condition) && condition.name != status) {
        condition.affected = condition.affected.filter(cr => {
          return cr.id != monster.id;
        });
      }
    });

    this.updateMultipleBuffs(conditions);
    return true;
  }

  // A status condition is permanent, invisible to players, and updates automatically based on the monster's health.
  isStatusCondition(condition: Condition): boolean {
    return ['dead', 'dying', 'disabled'].includes(condition.name) && condition.permanent && !condition.playerVisible;
  }

  goesBefore(c1: any, c2: any) : boolean {
  	// Should c1 go before c2 in initiative?
    if (c1.initiative < c2.initiative) {
      return false;
    } else if (c1.initiative > c2.initiative) {
      return true;
    } else if (c1.initiativeBonus > c2.initiativeBonus) {
      return true;
    } else {
      return false;
    }
  }

  getNewInitiative(order: Creature[], index: number, initiative?: number): number {
    // If a new creature is to be inserted into the order, calculate its new initiative
    // or return its old one if it's still valid in the new position
    if (index == 0) {
      // Edge case: new position is at the top of initiative order
      if (order.length && initiative != undefined && initiative > order[0].initiative) {
        return initiative;
      } else if (order.length) {
        return order[0].initiative + 1;
      } else {
        return initiative != undefined ? initiative : 0;
      }
    } else if (index == order.length) {
      // Edge case: new position is at the bottom of initiative order
      if (order.length && initiative != undefined && initiative < order[order.length - 1].initiative) {
        return initiative;
      } else if (order.length) {
        return order[order.length - 1].initiative - 1;
      } else {
        return initiative != undefined ? initiative : 0;
      }
    } else {
      // Normal case: new position is between two existing creatures
      let above = order[index - 1].initiative;
      let below = order[index].initiative;
      if (initiative != undefined && initiative < above && initiative > below) {
        return initiative;
      } else {
        let delta = (above - below) / 2;
        if (delta >= 1) {
          delta = Math.round(delta);
        }
        return below + delta;
      }
    }
  }
}

// Returns a random integer between min (included) and max (included)

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}