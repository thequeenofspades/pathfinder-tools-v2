import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { MessageService } from './message.service';
import { Monster } from './monster';

@Injectable({
  providedIn: 'root'
})
export class MonsterService {

  constructor(private messageService: MessageService) { }

  monsters: Monster[] = [
  	new Monster('Zombie', 100)];

  getMonsters(): Observable<Monster[]> {
  	return of(this.monsters);
  }

  addMonster(monster: Monster): Observable<Monster[]> {
  	this.messageService.add(`Added monster ${monster.name}!`);
  	for (var i = 0; i < monster.quantity; i++) {
  		let newMonster = Object.assign(new Monster('', 0), monster);
  		newMonster.id = i + 1;
  		this.monsters.push(newMonster);
  	}
  	return of(this.monsters);
  }

  removeMonster(monster: Monster): Observable<Monster[]> {
  	this.messageService.add(`Removed monster ${monster.name}`);
  	this.monsters = this.monsters.filter(m => m != monster);
  	return of(this.monsters);
  }

  updateMonster(monster: Monster, updated: Monster): Observable<Monster[]> {
  	this.messageService.add(`Updated monster ${monster.name}`);
  	let monsterToUpdate = this.monsters.indexOf(monster);
  	Object.assign(this.monsters[monsterToUpdate], updated);
  	return of(this.monsters);
  }

  clear(): Observable<Monster[]> {
  	this.messageService.add('Cleared all monsters');
    this.monsters = [];
    return of(this.monsters);
  }
}
