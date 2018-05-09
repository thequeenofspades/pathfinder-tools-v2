import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Player } from './player';
import { Monster } from './monster';
import { MessageService } from './message.service';
import { Condition } from './initiative/condition';

type Creature = Player | Monster;

@Injectable({
  providedIn: 'root'
})
export class InitiativeService {

  constructor(private messageService: MessageService) { }

  order: Creature[] = [];

  active: number = 0;

  round: number = 1;

  getOrder(): Observable<Creature[]> {
  	return of(this.order);
  }

  getActive(): Observable<number> {
    return of(this.active);
  }

  getRound(): Observable<number> {
    return of(this.round);
  }

  clear(): Observable<Creature[]> {
    this.messageService.add('Cleared initiative order');
    this.order = [];
    this.round = 1;
    this.active = 0;
    return of(this.order);
  }

  previous(): Observable<number> {
    this.active = this.active - 1;
    if (this.active < 0) {
      this.active = this.order.length - 1;
      this.round = this.round - 1;
    }
    return of(this.active);
  }

  advance(): Observable<number> {
    this.updateConditions(this.order[this.active]);
    this.active = this.active + 1;
    if (this.active >= this.order.length) {
      this.active = 0;
      this.round = this.round + 1;
    }
    this.messageService.add(`${this.order[this.active].name} no longer delayed`);
    this.order[this.active].attributes = this.order[this.active].attributes.filter(a => a != 'delayed');
    this.messageService.add(`${this.order[this.active].name}'s turn`);
    return of(this.active);
  }

  updateConditions(creature: Creature): void {
    for (let condition of creature.conditions) {
      if (!condition.permanent) {
        condition.duration--;
        if (condition.duration == 0) {
          this.messageService.add(`${this.order[this.active].name} is no longer ${condition.name}`);
        }
      }
    }
    creature.conditions = creature.conditions.filter(c => c.duration > 0 || c.permanent);
  }

  add(creature: Creature, initiative: number = null): Observable<Creature[]> {
    if (initiative == null) {
      initiative = getRandomInt(1, 20) + creature.initiativeBonus;
    }
    this.messageService.add(`Added ${creature.name} to initiative order`);
    creature.initiative = initiative;
  	let insertIndex = this.order.findIndex(c => this.goesBefore(creature, c));
    if (insertIndex < 0) {
      insertIndex = this.order.length;
    }
    this.order.splice(insertIndex, 0, creature);
  	return of(this.order);
  }

  remove(creature: Creature): Observable<Creature[]> {
    this.messageService.add(`Removed ${creature.name} from initiative order`);
    let idx = this.order.findIndex(c => c == creature);
    this.order = this.order.filter(c => c != creature);
    return of(this.order);
  }

  moveUp(creature: Creature): Observable<Creature[]> {
    this.messageService.add(`Moved ${creature.name} up in initiative order`);
    creature.attributes.push('moved');
    let originalIndex: number = this.order.findIndex(c => c == creature);
    this.order.splice(originalIndex, 1);
    let newIndex: number = originalIndex - 1;
    if (originalIndex == 0) {
      newIndex = this.order.length;
    }
    this.order.splice(newIndex, 0, creature);
    return of(this.order);
  }

  moveDown(creature: Creature): Observable<Creature[]> {
    this.messageService.add(`Moved ${creature.name} down in initiative order`);
    creature.attributes.push('moved');
    let originalIndex: number = this.order.findIndex(c => c == creature);
    this.order.splice(originalIndex, 1);
    let newIndex: number = originalIndex + 1;
    if (originalIndex == this.order.length) {
      newIndex = 0;
    }
    this.order.splice(newIndex, 0, creature);
    return of(this.order);
  }

  damage(creature: Creature, amount: number): Observable<Creature[]> {
    this.messageService.add(`${creature.name} took ${amount} damage`);
    this.checkHpStatus((creature as Monster), amount);
    (creature as Monster).currentHp = (creature as Monster).currentHp - amount;
    return of(this.order);
  }

  checkHpStatus(monster: Monster, amount: number): void {
    monster.removeConditions(['dead', 'dying', 'disabled', 'bloodied']);
    if (monster.isDead(amount)) {
      this.applyDeath(monster);
    } else if (monster.isDying(amount)) {
      this.applyDying(monster);
    } else if (monster.isDisabled(amount)) {
      this.applyDisabled(monster);
    } else if (monster.isBloodied(amount) && !monster.isBloodied()) {
      this.applyBloodied(monster);
    }
  }

  applyBloodied(monster: Monster) {
    this.messageService.add(`${monster.name} became bloodied`);
    monster.attributes.push('bloodied');
  }

  applyDeath(monster: Monster) {
    this.messageService.add(`${monster.name} died!`);
    monster.attributes.push('dead');
    let deadCondition = new Condition('dead', 0, true);
    this.addCondition(monster, deadCondition, false);
  }

  applyDying(monster: Monster) {
    this.messageService.add(`${monster.name} is dying!`);
    monster.attributes.push('dying');
    let dyingCondition = new Condition('dying', 0, true);
    this.addCondition(monster, dyingCondition, false);
  }

  applyDisabled(monster: Monster) {
    this.messageService.add(`${monster.name} is at 0 hp and disabled`);
    monster.attributes.push('disabled');
    let disabledCondition = new Condition('disabled', 0, true);
    this.addCondition(monster, disabledCondition, false);
  }

  addCondition(creature: Creature, condition: Condition, log: boolean = true): Observable<Creature[]> {
    console.log(creature, condition);
    if (log) {
      this.messageService.add(`${creature.name} became ${condition.name} for ${condition.duration} rounds`);
    }
    creature.conditions.push(condition);
    return of(this.order);
  }

  removeCondition(creature: Creature, condition: Condition): Observable<Creature[]> {
    creature.conditions = creature.conditions.filter(c => c != condition);
    return of(this.order);
  }

  addNote(creature: Creature, note: string): Observable<Creature[]> {
    creature.notes.push(note);
    return of(this.order);
  }

  removeNote(creature: Creature, note: string): Observable<Creature[]> {
    creature.notes = creature.notes.filter(n => n != note);
    return of(this.order);
  }

  delay(creature: Creature): Observable<Creature[]> {
    this.messageService.add(`${creature.name} delayed`);
    creature.attributes.push('delayed');
    this.active = this.active + 1;
    if (this.active >= this.order.length) {
      this.active = 0;
      this.round = this.round + 1;
    }
    this.messageService.add(`${this.order[this.active].name}'s turn`);
    return of(this.order);
  }

  undelay(creature: Creature): Observable<Creature[]> {
    this.messageService.add(`${creature.name} undelayed`);
    creature.attributes = creature.attributes.filter(a => a != 'delayed');
    this.remove(creature);
    this.order.splice(this.active + 1, 0, creature);
    return of(this.order);
  }

  goesBefore(c1: Creature, c2: Creature) : boolean {
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