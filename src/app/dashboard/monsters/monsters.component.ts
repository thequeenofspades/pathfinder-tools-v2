import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Monster } from '../monster';
import { InitiativeService } from '../initiative.service';
import { EncounterService } from '../encounter.service';
import { Encounter } from '../encounter';

@Component({
  selector: 'app-monsters',
  templateUrl: './monsters.component.html',
  styleUrls: ['./monsters.component.css']
})
export class MonstersComponent implements OnInit {

  constructor(public initiativeService: InitiativeService,
    public encounterService: EncounterService,
    private route: ActivatedRoute) { }

  badges = {};

  ngOnInit() {
    this.route.data.subscribe((data: {id: string}) => {
      this.initiativeService.setup(data.id);
      this.encounterService.setup(data.id);
    });
  }

  newEncounter(name: string): void {
    this.encounterService.newEncounter(name);
  }

  add(monster: Monster, encounter: Encounter = null): void {
    let monsters = this.encounterService.createMonsters(monster);
    if (encounter != null) {
      this.encounterService.addMultipleToEncounter(monsters, encounter);
    } else {
      this.initiativeService.addMultiple(monsters);
    }
  }

  rollPerception(monster: Monster): void {
    let roll = getRandomInt(1, 20);
    monster.notification.perception = `${roll+monster.perceptionBonus}`;
  }

  rollSenseMotive(monster: Monster): void {
    let roll = getRandomInt(1, 20);
    monster.notification.senseMotive = `${roll+monster.senseMotiveBonus}`;
  }

  rollPerceptionForEncounter(encounter: Encounter): void {
    for (let monster of encounter.monsters) {
      this.badges[monster.id] = getRandomInt(1, 20) + monster.perceptionBonus;
    }
  }

  rollSMForEncounter(encounter: Encounter): void {
    for (let monster of encounter.monsters) {
      this.badges[monster.id] = getRandomInt(1, 20) + monster.senseMotiveBonus;
    }
  }

}

// Returns a random integer between min (included) and max (included)

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}