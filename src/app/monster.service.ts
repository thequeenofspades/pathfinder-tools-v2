import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { MessageService } from './message.service';
import { Monster } from './monster';

@Injectable({
  providedIn: 'root'
})
export class MonsterService {

  constructor(private messageService: MessageService) { }

  createMonsters(monster: Monster): Observable<Monster[]> {
    let monsters = [];
    for (var i = 0; i < monster.quantity; i++) {
      let newMonster = this.deepCopyMonster(monster);
      newMonster.id = i + 1;
      monsters.push(newMonster);
    }
    return of(monsters);
  }

  deepCopyMonster(monster: Monster): Monster {
    let newMonster = new Monster(monster.name, monster.hp);
    Object.assign(newMonster, monster);
    newMonster.conditions = [];
    newMonster.attributes = [];
    newMonster.notes = [];
    newMonster.notification = {};
    return newMonster;
  }

  updateMonster(monster: Monster, updated: Monster): Observable<Monster> {
  	this.messageService.add(`Updated monster ${monster.name}`);
  	Object.assign(monster, updated);
  	return of(monster);
  }

}
