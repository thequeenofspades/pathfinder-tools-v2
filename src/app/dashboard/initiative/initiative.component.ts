import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { Player } from '../player';
import { Monster } from '../monster';
import { InitiativeService } from '../initiative.service';
import { Condition } from '../condition';

import { NoteFormComponent } from './note-form.component';
import { ConditionFormComponent } from './condition-form.component';
import { DamageFormComponent } from './damage-form.component';
import { ConditionDetailComponent } from './condition-detail/condition-detail.component';
import { CreatureDetailComponent } from './creature-detail/creature-detail.component'

type Creature = Player | Monster;

@Component({
  selector: 'app-initiative',
  templateUrl: './initiative.component.html',
  styleUrls: ['./initiative.component.css'],
  providers: [InitiativeService]
})
export class InitiativeComponent implements OnInit {

  constructor(public initiativeService: InitiativeService,
    public dialog: MatDialog,
    private route: ActivatedRoute) { }

  @ViewChild(CreatureDetailComponent) private detailComponent: CreatureDetailComponent;

  ngOnInit() {
    this.route.data.subscribe((data: {id: string}) => {
      this.code = data.id;
      this.initiativeService.setup(data.id);
    });
  }

  code: string;

  selectCreature(creature: Creature): void {
    this.detailComponent.creature = creature;
    this.initiativeService.init$.subscribe(_ => {
        this.initiativeService.get(this.detailComponent.creature.id).subscribe(c => 
          this.detailComponent.creature = c);
      });
  }

  openDamageFormDialog(creature: Creature): void {
    let dialogRef = this.dialog.open(DamageFormComponent, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(dmg => {
      if (dmg !== undefined) {
        this.initiativeService.damage(creature, dmg);
      }
    });
  }

  openConditionFormDialog(creature: Creature): void {
    let dialogRef = this.dialog.open(ConditionFormComponent, {
      width: '500px'
    });
    dialogRef.afterClosed().subscribe(condition => {
      if (condition !== undefined) {
        this.initiativeService.applyCondition(creature, condition);
      }
    });
  }

  openNoteFormDialog(creature: Creature): void {
    let dialogRef = this.dialog.open(NoteFormComponent, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(note => {
      if (note !== undefined) {
        this.initiativeService.addNote(creature, note);
      }
    });
  }

  openConditionDetailDialog(condition: Condition): void {
      let dialogRef = this.dialog.open(ConditionDetailComponent, {
        width: '400px',
        data: condition
      });
  }

  adjusted(creature: Creature): boolean {
  	return creature.attributes.some(a => a == "moved");
  }

  delayed(creature: Creature): boolean {
  	return creature.attributes.some(a => a == "delayed");
  }

  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
