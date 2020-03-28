import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Monster, MonsterI } from '../monster';
import { InitiativeService } from '../initiative.service';
import { EncounterService } from '../encounter.service';
import { Encounter } from '../encounter';
import { MatDialog } from '@angular/material/dialog';
import { MoveToEncounterFormComponent } from './move-to-encounter-form/move-to-encounter-form.component';

@Component({
  selector: 'app-monsters',
  templateUrl: './monsters.component.html',
  styleUrls: ['./monsters.component.css']
})
export class MonstersComponent implements OnInit {

  constructor(public initiativeService: InitiativeService,
    public encounterService: EncounterService,
    private route: ActivatedRoute,
    public dialog: MatDialog) { }

  badges = {};
  edit = {};

  ngOnInit() {
    this.route.data.subscribe((data: {id: string}) => {
      this.initiativeService.setup(data.id);
      this.encounterService.setup(data.id);
    });
  }

  newEncounter(name: string): void {
    this.encounterService.newEncounter(name);
  }

  add(monster: MonsterI, encounter: Encounter = null): void {
    let monsters = this.encounterService.createMonsters(monster);
    if (encounter != null) {
      this.encounterService.addMultipleToEncounter(monsters, encounter);
    } else {
      let creatures = monsters.map(monster => this.encounterService.prepareMonsterForInitiative(monster));
      this.initiativeService.addMultiple(creatures);
    }
  }

  addToInitiative(monster: MonsterI): void {
    this.initiativeService.add(this.encounterService.prepareMonsterForInitiative(monster));
  }

  duplicate(monster: MonsterI, encounter: Encounter): void {
    let monsterCopy: MonsterI = this.encounterService.duplicateMonster(monster);
    this.encounterService.addToEncounter(monsterCopy, encounter);
  }

  moveToEncounter(monster: MonsterI, oldEncounter: Encounter): void {
    let dialogRef = this.dialog.open(MoveToEncounterFormComponent, {
      data: {
        encounters: this.encounterService.encounters$
      },
      width: '250px'
    });
    dialogRef.afterOpened().subscribe(_ => {
      this.encounterService.refresh();
    });
    dialogRef.afterClosed().subscribe((newEncounter: Encounter) => {
      if (newEncounter == undefined) {
        return;
      }
      this.encounterService.moveMonsterToEncounter(monster, oldEncounter, newEncounter);
    });
  }

  rollPerceptionForEncounter(encounter: Encounter): void {
    for (let monster of encounter.monsters) {
      this.badges[monster.id] = getRandomInt(1, 20) + monster.basics.perceptionBonus;
    }
  }

}

// Returns a random integer between min (included) and max (included)

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}