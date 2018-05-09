import { Component, OnInit } from '@angular/core';

import { Monster } from '../../monster';
import { MonsterService } from '../../monster.service';
import { InitiativeService } from '../../initiative.service';
import { EncounterService } from '../encounter.service';
import { Encounter } from '../encounter';

@Component({
  selector: 'app-monsters',
  templateUrl: './monsters.component.html',
  styleUrls: ['./monsters.component.css']
})
export class MonstersComponent implements OnInit {

  constructor(private monsterService: MonsterService,
  	private initiativeService: InitiativeService,
    private encounterService: EncounterService) { }

  ngOnInit() {
    this.getEncounters();
  }

  encounters: Encounter[];

  getEncounters(): void {
    this.encounterService.getEncounters()
      .subscribe(encounters => this.encounters = encounters);
  }

  add(monster: Monster, encounter: Encounter = null): void {
    this.monsterService.createMonsters(monster)
      .subscribe(monsters => {
        for (let monster of monsters) {
          if (encounter != null) {
            this.encounterService.addToEncounter(monster, encounter)
              .subscribe(encounters => this.encounters = encounters);
          } else {
            this.addToInitiative(monster);
          }
        }
      });
  }

  remove(monster: Monster, encounter: Encounter = null): void {
    if (encounter != null) {
      this.encounterService.removeFromEncounter(monster, encounter)
        .subscribe(encounters => this.encounters = encounters);
    }
  }

  removeEncounter(encounter: Encounter): void {
    this.encounterService.removeEncounter(encounter)
      .subscribe(encounters => this.encounters = encounters);
  }

  update(monster: Monster, updated: Monster) : void {
  	this.monsterService.updateMonster(monster, updated).subscribe();
  }

  addToInitiative(monster: Monster): void {
  	let roll = getRandomInt(1, 20);
    let monsterCopy = this.monsterService.deepCopyMonster(monster);
  	this.initiativeService.add(monsterCopy, roll + monster.initiativeBonus);
  }

  addEncounterToInitiative(encounter: Encounter): void {
    this.encounterService.addEncounterToInitiative(encounter);
  }

}

// Returns a random integer between min (included) and max (included)

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}