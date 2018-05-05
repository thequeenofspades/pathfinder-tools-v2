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
    for (let condition of this.order[this.active].conditions) {
      condition.duration = condition.duration - 1;
      if (condition.duration == 0) {
        this.messageService.add(`${this.order[this.active].name} is no longer ${condition.name}`);
      }
    }
    this.order[this.active].conditions = this.order[this.active].conditions.filter(c => c.duration > 0);
    this.active = this.active + 1;
    if (this.active >= this.order.length) {
      this.active = 0;
      this.round = this.round + 1;
    }
    this.messageService.add(`${this.order[this.active].name}'s turn`);
    return of(this.active);
  }

  add(creature: Creature, initiative: number): Observable<Creature[]> {
    this.messageService.add(`Added ${creature.name} to initiative order`);
    let creatureCopy = Object.assign({}, creature);
  	creatureCopy.initiative = initiative;
  	let insertIndex = this.order.findIndex(c => this.goesBefore(creatureCopy, c));
    if (insertIndex < 0) {
      insertIndex = this.order.length;
    }
    // if (insertIndex <= this.active) {
    //   this.active = this.active + 1;
    // }
  	this.order.splice(insertIndex, 0, creatureCopy);
  	return of(this.order);
  }

  remove(creature: Creature): Observable<Creature[]> {
    this.messageService.add(`Removed ${creature.name} from initiative order`);
    let idx = this.order.findIndex(c => c == creature);
    // if (idx < this.active) {
    //   this.active = this.active - 1;
    // }
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
    if ((creature as Monster).currentHp - amount <= (creature as Monster).hp / 2 &&
          (creature as Monster).currentHp > (creature as Monster).hp / 2) {
      this.messageService.add(`${creature.name} became bloodied`);
      creature.attributes.push('bloodied');
    }
    (creature as Monster).currentHp = (creature as Monster).currentHp - amount;
    if ((creature as Monster).currentHp == 0) {
      this.messageService.add(`${creature.name} died!`);
      creature.attributes.push('dead');
    }
    return of(this.order);
  }

  addCondition(creature: Creature, condition: Condition): Observable<Creature[]> {
    this.messageService.add(`${creature.name} became ${condition.name} for ${condition.duration} rounds`);
    creature.conditions.push(condition);
    return of(this.order);
  }

  addNote(creature: Creature, note: string): Observable<Creature[]> {
    creature.notes.push(note);
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
