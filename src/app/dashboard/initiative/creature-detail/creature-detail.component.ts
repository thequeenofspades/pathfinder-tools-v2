import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material';

import { Player } from '../../player';
import { Monster, Creature } from '../../monster';
import { Condition } from '../../condition';
import { InitiativeService } from '../../initiative.service';
import { ConditionDetailComponent } from '../condition-detail/condition-detail.component';

@Component({
  selector: 'app-creature-detail',
  templateUrl: './creature-detail.component.html',
  styleUrls: ['./creature-detail.component.css']
})
export class CreatureDetailComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  @Input() initService: InitiativeService;
  creature: any;

  perceptionBadges = {};
  smBadges = {};

  openConditionDetailDialog(condition: Condition): void {
	  let dialogRef = this.dialog.open(ConditionDetailComponent, {
	    width: '400px',
	    data: condition
	  });
  }

  rollPerception(creature: Creature): void {
    let roll = this.getRandomInt(1, 20);
    this.perceptionBadges[creature.id] = roll + creature.perceptionBonus;
  }

  // rollSenseMotive(creature: Creature): void {
  //   let roll = this.getRandomInt(1, 20);
  //   this.smBadges[creature.id] = roll + creature.senseMotiveBonus;
  // }

  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
