import { Injectable } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Player } from './player';
import { Monster } from './monster';
import { MessageService } from '../message.service';
import { Condition } from './condition';

interface Creature {
  id: string;
  name: string;
  initiativeBonus: number;
  attributes: string[];
  conditions: Condition[];
}

class Initiative {
  order: any[];
  active: number;
  round: number;
}

@Injectable({
  providedIn: 'root'
})
export class InitiativeService {

  constructor(private messageService: MessageService,
    private db: AngularFirestore) {
  }

  initDoc: AngularFirestoreDocument<any>;

  init = new Subject<any>();
  init$ = this.init.asObservable();

  setup(sessionId: string): void {
    this.initDoc = this.db.collection('sessions').doc(sessionId);
    this.initDoc.ref.get().then(doc => {
      if (!doc.data().order) {
        this.initDoc.set({
          order: [],
          active: 0,
          round: 1,
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
        return doc.data().playerOptions ? doc.data().playerOptions : {
          'healthOption': 'None',
          'conditionOption': 'None'
        };
      }));
  }

  updatePlayerOptions(options: Object): void {
    this.initDoc.update({playerOptions: options}).then(_ => {
      this.messageService.add('Updated player view options');
    });
  }

  add(creature: Creature, initiative: number = null): void {
    this.initDoc.ref.get().then(doc => {
      let order = doc.data().order || [];
      if (initiative == null) initiative = getRandomInt(1, 20) + creature.initiativeBonus;
      let creatureCopy = {
        ...creature,
        initiative: initiative,
        id: this.db.createId()
      };
      let insertIndex = order.findIndex(c => this.goesBefore(creatureCopy, c));
      if (insertIndex < 0) {
        insertIndex = order.length;
      }
      order.splice(insertIndex, 0, creatureCopy);
      this.initDoc.update({order: order}).then(_ => {
        this.messageService.add(`Added ${creature.name} to initiative order`);
      });
    });
  }

  addMultiple(creatures: Creature[]): void {
    this.initDoc.ref.get().then(doc => {
      let order = doc.data().order || [];
      creatures.forEach((creature, i) => {
        let creatureCopy = {
          ...creature,
          initiative: getRandomInt(1, 20) + creature.initiativeBonus
        };
        let insertIndex = order.findIndex(c => this.goesBefore(creatureCopy, c));
        if (insertIndex < 0) insertIndex = order.length;
        order.splice(insertIndex, 0, creatureCopy);
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
      if (active < 0) {
        active = (doc.data().order || []).length - 1;
        this.initDoc.update({round: (doc.data().round || 1) - 1});
      }
      this.initDoc.update({active: active});
    });
  }

  advance(): void {
    this.initDoc.ref.get().then(doc => {
      let active = doc.data().active || 0;
      let order = doc.data().order || [];
      let round = doc.data().round || 1;
      this.updateConditions(order[active]);
      active += 1;
      if (active >= order.length) {
        active = 0;
        round += 1;
      }
      order[active].attributes = order[active].attributes.filter(a => a != 'delayed');
      this.initDoc.update({active: active, order: order, round: round}).then(_ => {
        this.messageService.add(`${order[active].name}'s turn`);
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

  moveUp(creature: Creature): void {
    this.initDoc.ref.get().then(doc => {
      let order = doc.data().order || [];
      creature.attributes.push('moved');
      let originalIdx: number = order.findIndex(c => c.id == creature.id);
      order.splice(originalIdx, 1);
      let newIdx: number = originalIdx - 1;
      if (originalIdx == 0) newIdx = order.length;
      order.splice(newIdx, 0, creature);
      this.initDoc.update({order: order}).then(_ => {
        this.messageService.add(`Moved ${creature.name} up in initiative order`);
      });
    });
  }

  moveDown(creature: Creature): void {
    this.initDoc.ref.get().then(doc => {
      let order = doc.data().order || [];
      creature.attributes.push('moved');
      let originalIdx: number = order.findIndex(c => c.id == creature.id);
      order.splice(originalIdx, 1);
      let newIdx: number = originalIdx + 1;
      if (originalIdx == order.length) newIdx = 0;
      order.splice(newIdx, 0, creature);
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
      if (crIdx < active) active -= 1;
      creature.attributes = creature.attributes.filter(a => a != 'delayed');
      order.splice(crIdx, 1);
      let newIdx = active + 1;
      if (newIdx > order.length) newIdx = order.length;
      order.splice(newIdx, 0, creature);
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
      cr.conditions = cr.conditions.filter(c => c.name != condition.name);
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

  checkHpStatus(monster: Monster, amount: number): void {
    this.removeConditions(monster, ['dead', 'dying', 'disabled', 'bloodied']);
    if (monster.currentHp - amount <= -1 * monster.conScore) {
      this.messageService.add(`${monster.name} died!`);
      monster.attributes.push('dead');
      let deadCondition = new Condition('dead', 0, true);
      this.addConditionSync(monster, deadCondition, false);
    } else if (monster.currentHp - amount < 0 && monster.currentHp - amount > -1 * monster.conScore) {
      this.messageService.add(`${monster.name} is dying!`);
      monster.attributes.push('dying');
      let dyingCondition = new Condition('dying', 0, true);
      this.addConditionSync(monster, dyingCondition, false);
    } else if (monster.currentHp - amount == 0) {
      this.messageService.add(`${monster.name} is at 0 hp and disabled`);
      monster.attributes.push('disabled');
      let disabledCondition = new Condition('disabled', 0, true);
      this.addConditionSync(monster, disabledCondition, false);
    } else if (monster.currentHp - amount <= monster.hp / 2 && !(monster.currentHp > monster.hp / 2)) {
      this.messageService.add(`${monster.name} became bloodied`);
      monster.attributes.push('bloodied');
    }
  }

  removeConditions(monster: Monster, conditions: string[]) {
    monster.conditions = monster.conditions.filter(c => !conditions.find(name => name == c.name));
    monster.attributes = monster.attributes.filter(a => !conditions.find(name => name == a));
  };

  addConditionSync(creature: Creature, condition: Condition, log: boolean = true): void {
    if (log) {
      this.messageService.add(`${creature.name} became ${condition.name} for ${condition.duration} rounds`);
    }
    creature.conditions.push(condition);
  }

  goesBefore(c1: any, c2: any) : boolean {
  	// Should c1 go before c2 in initiative?
    if (c2.attributes.indexOf('moved') > -1) {
      return false;
    } else if (c1.initiative < c2.initiative) {
      return false;
    } else if (c1.initiative > c2.initiative) {
      return true;
    } else if (c1.initiativeBonus > c2.initiativeBonus) {
      return true;
    } else {
      return false;
    }
  }
}

// Returns a random integer between min (included) and max (included)

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}