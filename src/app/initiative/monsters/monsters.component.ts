import { Component, OnInit } from '@angular/core';

import { Monster } from '../../monster';
import { MonsterService } from '../../monster.service';
import { InitiativeService } from '../../initiative.service';

@Component({
  selector: 'app-monsters',
  templateUrl: './monsters.component.html',
  styleUrls: ['./monsters.component.css']
})
export class MonstersComponent implements OnInit {

  constructor(private monsterService: MonsterService,
  	private initiativeService: InitiativeService) { }

  ngOnInit() {
  	this.getMonsters();
  }

  monsters: Monster[];

  showNewMonsterForm: boolean = false;

  private getMonsters(): void {
  	this.monsterService.getMonsters()
  		.subscribe(monsters => this.monsters = monsters);
  }

  add(monster: Monster): void {
  	this.monsterService.addMonster(monster)
  		.subscribe(monsters => this.monsters = monsters);
  }

  remove(monster: Monster): void {
  	this.monsterService.removeMonster(monster)
  		.subscribe(monsters => this.monsters = monsters);
  }

  update(monster: Monster, updated: Monster) : void {
  	this.monsterService.updateMonster(monster, updated)
  		.subscribe(monsters => this.monsters = monsters);
  }

  clear(): void {
  	this.monsterService.clear()
  		.subscribe(monsters => this.monsters = monsters);
  }

  addToInitiative(monster: Monster): void {
  	let roll = getRandomInt(1, 20);
  	this.initiativeService.add(monster, roll + monster.initiativeBonus);
  }

  addAllToInitiative(): void {
    for (let monster of this.monsters) {
      this.addToInitiative(monster);
    }
  }

}

// Returns a random integer between min (included) and max (included)

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}