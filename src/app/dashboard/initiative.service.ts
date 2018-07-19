import { Injectable } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { randomColor } from 'randomcolor';

import { Player } from './player';
import { Monster, Creature } from './monster';
import { MessageService } from '../message.service';
import { Condition, CONDITIONS } from './condition';

class Initiative {
  order: any[];
  active: number;
  round: number;
}

const defaultPlayerOptions = {
  nameOption: 'Show names',
  healthOption: 'Health bar',
  conditionOption: 'Condition only',
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

  private init = new Subject<any>();
  public init$ = this.init.asObservable();

  private active = new Subject<Creature>();
  public active$ = this.active.asObservable();

  setup(sessionId: string): void {
    this.initDoc = this.db.collection('sessions').doc(sessionId);
    this.initDoc.ref.get().then(doc => {
      if (!doc.data().order) {
        this.initDoc.set({
          order: [],
          active: 0,
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

  getPlayerOptions(): Observable<Object> {
    return Observable.fromPromise(this.initDoc.ref.get()).pipe(
      take(1),
      map(doc => {
        return doc.data().playerOptions ? doc.data().playerOptions : defaultPlayerOptions;
      }));
  }

  updatePlayerOptions(options: Object): void {
    this.initDoc.update({playerOptions: options}).then(_ => {
      this.messageService.add('Updated player view options');
    });
  }

  get(id: string): Observable<Creature> {
    return Observable.fromPromise(this.initDoc.ref.get()).pipe(
      map(doc => {
        let order = doc.data().order || [];
        return order.find(c => c.id == id);
      }));
  }

  add(creature: Creature, initiative: number = null): void {
    this.initDoc.ref.get().then(doc => {
      let order = doc.data().order || [];
      let playerOptions = doc.data().playerOptions || {}
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
      // order.splice(insertIndex, 0, creatureCopy);
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
      let playerOptions = doc.data().playerOptions || {}
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
        // order.splice(insertIndex, 0, creatureCopy);
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
      this.updateConditions(order[active]);
      active += 1;
      if (active >= order.length) {
        active = 0;
        round += 1;
      }
      let curr = (order[active] as any).initiative;
      buffs = this.updateBuffs(prev, curr, buffs);
      order[active].attributes = order[active].attributes.filter(a => a != 'delayed');
      this.initDoc.update({active: active, order: order, round: round, buffs: buffs}).then(_ => {
        this.messageService.add(`${order[active].name}'s turn`);
        this.active.next(order[active]);
      });
    });
  }

  updateConditions(creature: Creature): void {
    for (let condition of creature.conditions) {
      if (!condition.permanent) {
        condition.duration--;
        if (condition.duration == 0) {
          this.messageService.add(`${creature.name} is no longer ${condition.name}`);
        }
      }
    }
    creature.conditions = creature.conditions.filter(c => c.duration > 0 || c.permanent);
  }

  updateBuffs(prev: number, curr: number, buffs: {duration: number, initiative: number}[]): {}[] {
    return buffs.map(buff => {
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
      return buff.duration > 0;
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
      //creature.attributes.push('moved');
      let originalIdx: number = order.findIndex(c => c.id == creature.id);
      order.splice(originalIdx, 1);
      let newIdx: number = originalIdx - 1;
      if (originalIdx == 0) newIdx = order.length;
      // if (originalIdx == 0) {
      //   newIdx = order.length;
      //   creature.initiative = order[newIdx - 1].initiative;
      // } else {
      //   creature.initiative = order[newIdx].initiative;
      // }
      order = this.insertCreature(order, newIdx, creature);
      //order.splice(newIdx, 0, creature);
      this.initDoc.update({order: order}).then(_ => {
        this.messageService.add(`Moved ${creature.name} up in initiative order`);
      });
    });
  }

  moveDown(creature: Creature): void {
    this.initDoc.ref.get().then(doc => {
      let order = doc.data().order || [];
      //creature.attributes.push('moved');
      let originalIdx: number = order.findIndex(c => c.id == creature.id);
      order.splice(originalIdx, 1);
      let newIdx: number = originalIdx + 1;
      // if (originalIdx == order.length) {
      //   newIdx = 0;
      //   creature.initiative = order[0].initiative;
      // } else {
      //   creature.initiative = order[newIdx - 1].initiative;
      // }
      if (originalIdx == order.length) newIdx = 0;
      order = this.insertCreature(order, newIdx, creature);
      // order.splice(newIdx, 0, creature);
      this.initDoc.update({order: order}).then(_ => {
        this.messageService.add(`Moved ${creature.name} down in initiative order`);
      });
    });
  }

  delay(creature: Creature): void {
    this.initDoc.ref.get().then(doc => {
      let order = doc.data().order || [];
      let crIdx = order.findIndex(c => c.id == creature.id);
      order[crIdx].attributes.push('delayed');
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
      // creature.initiative = order[active].initiative;
      if (crIdx < active) active -= 1;
      creature.attributes = creature.attributes.filter(a => a != 'delayed');
      order.splice(crIdx, 1);
      let newIdx = active + 1;
      if (newIdx > order.length) newIdx = order.length;
      order = this.insertCreature(order, newIdx, creature);
      // order.splice(newIdx, 0, creature);
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

  applyCondition(creature: Creature, condition: Condition): void {
    this.initDoc.ref.get().then(doc => {
      let order = doc.data().order || [];
      let cr = order.find(c => c.id == creature.id);
      this.addConditionSync(cr, condition);
      this.initDoc.update({order: order});
    });
  }

  removeCondition(creature: Creature, condition: Condition): void {
    this.initDoc.ref.get().then(doc => {
      let order = doc.data().order || [];
      let cr = order.find(c => c.id == creature.id);
      cr.conditions = cr.conditions.filter(c => c.id != condition.id);
      this.initDoc.update({order: order});
    });
  }

  addNote(creature: Creature, note: string): void {
    this.initDoc.ref.get().then(doc => {
      let order = doc.data().order || [];
      let cr = order.find(c => c.id == creature.id);
      cr.notes.push(note);
      this.initDoc.update({order: order});
    });
  }

  removeNote(creature: Creature, note: string): void {
    this.initDoc.ref.get().then(doc => {
      let order = doc.data().order || [];
      let cr = order.find(c => c.id == creature.id);
      cr.notes = cr.notes.filter(n => n != note);
      this.initDoc.update({order: order});
    });
  }

  addBuff(buff: {}): void {
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

  updateBuff(buff: {id: string}): void {
    this.initDoc.ref.get().then(doc => {
      let buffs = doc.data().buffs || [];
      let buffIdx = buffs.findIndex(b => b.id == buff.id);
      buffs[buffIdx] = buff;
      this.initDoc.update({buffs: buffs});
    });
  }

  removeBuff(buff: {id: string}): void {
    this.initDoc.ref.get().then(doc => {
      let buffs = doc.data().buffs || [];
      buffs = buffs.filter(b => b.id != buff.id);
      this.initDoc.update({buffs: buffs});
    });
  }

  clearBuffs(): void {
    this.initDoc.update({buffs: []});
  }

  changeBuffColor(buff: {id: string}): void {
    this.initDoc.ref.get().then(doc => {
      let buffs = doc.data().buffs || [];
      let buffIndex = buffs.findIndex(b => b.id == buff.id);
      buffs[buffIndex].color = randomColor();
      this.initDoc.update({buffs: buffs});
    });
  }

  checkHpStatus(monster: Monster, amount: number): void {
    this.removeConditionsByName(monster, ['dead', 'dying', 'disabled', 'bloodied']);
    if (monster.currentHp - amount <= -1 * monster.conScore) {
      this.messageService.add(`${monster.name} died!`);
      monster.attributes.push('dead');
      let deadCondition = {
        name: 'dead',
        duration: 0,
        permanent: true,
        description: CONDITIONS.find(c => c.name == 'dead').description
      };
      this.addConditionSync(monster, deadCondition, false);
    } else if (monster.currentHp - amount < 0 && monster.currentHp - amount > -1 * monster.conScore) {
      this.messageService.add(`${monster.name} is dying!`);
      monster.attributes.push('dying');
      let dyingCondition = {
        name: 'dying',
        duration: 0,
        permanent: true,
        description: CONDITIONS.find(c => c.name == 'dying').description
      };
      this.addConditionSync(monster, dyingCondition, false);
    } else if (monster.currentHp - amount == 0) {
      this.messageService.add(`${monster.name} is at 0 hp and disabled`);
      monster.attributes.push('disabled');
      let disabledCondition = {
        name: 'disabled',
        duration: 0,
        permanent: true,
        description: CONDITIONS.find(c => c.name == 'disabled').description
      };
      this.addConditionSync(monster, disabledCondition, false);
    } else if (monster.currentHp - amount <= monster.hp / 2 && !(monster.currentHp > monster.hp / 2)) {
      this.messageService.add(`${monster.name} became bloodied`);
      monster.attributes.push('bloodied');
    }
  }

  removeConditionsByName(monster: Monster, conditions: string[]) {
    monster.conditions = monster.conditions.filter(c => !conditions.find(name => name == c.name));
    monster.attributes = monster.attributes.filter(a => !conditions.find(name => name == a));
  };

  addConditionSync(creature: Creature, condition: any, log: boolean = true): void {
    if (log && !condition.permanent) {
      this.messageService.add(`${creature.name} became ${condition.name} for ${condition.duration} rounds`);
    } else if (log && condition.permanent) {
      this.messageService.add(`${creature.name} became ${condition.name}`);
    }
    let conditionCopy: Condition = {...condition, id: this.db.createId()};
    creature.conditions.push(conditionCopy);
  }

  goesBefore(c1: any, c2: any) : boolean {
  	// Should c1 go before c2 in initiative?
    // if (c2.attributes.indexOf('moved') > -1) {
    //   return false;
    // }
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