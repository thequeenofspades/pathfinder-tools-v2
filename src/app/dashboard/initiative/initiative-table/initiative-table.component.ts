import { Component, OnInit, Input, ViewChild, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material';

import { InitiativeService } from '../../initiative.service';
import { Creature } from '../../monster';
import { Condition } from '../../condition';

import { NoteFormComponent } from '../note-form.component';
import { ConditionFormComponent } from '../condition-form.component';
import { DamageFormComponent } from '../damage-form.component';
import { ConditionDetailComponent } from '../condition-detail/condition-detail.component';
import { CreatureDetailComponent } from '../creature-detail/creature-detail.component';
import { CreaturePopoutComponent } from '../creature-detail/creature-popout.component';

@Component({
  selector: 'app-initiative-table',
  templateUrl: './initiative-table.component.html',
  styleUrls: ['./initiative-table.component.scss']
})
export class InitiativeTableComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  	this.initiativeService.active$.subscribe(active => {
      if (active.hp != undefined) {
        this.selectCreature(active);
      }
  	})
  }

  @Input() initiativeService: InitiativeService;
  @Input() init;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.listenArrowKeys) {
      event.stopPropagation();
      if (event.key == 'ArrowRight') this.initiativeService.advance();
      if (event.key == 'ArrowLeft') this.initiativeService.previous();
    }
  };

  @ViewChild(CreatureDetailComponent) public detailComponent: CreatureDetailComponent;

  code: string;

  badges = {};

  listenArrowKeys: boolean = true;

  protected showDetail: boolean = false;

  selectCreature(creature: Creature): void {
    this.detailComponent.creature = creature;
    this.showDetail = true;
    this.initiativeService.init$.subscribe(_ => {
      if (this.detailComponent && this.detailComponent.creature) {
        this.initiativeService.get(this.detailComponent.creature.id).subscribe(c => {
          if (c) {
            this.detailComponent.creature = c;
          } else {
            this.showDetail = false;
          }
        });
      }
      });
  }

  unselect(): void {
    this.detailComponent.creature = null;
    this.showDetail = false;
  }

  openCreaturePreview(): void {
    this.listenArrowKeys = false;
    let dialogRef = this.dialog.open(CreaturePopoutComponent, {
      height: '100vh',
      width: '500px',
      data: this.detailComponent.creature
    });
    dialogRef.afterClosed().subscribe(() => {
      this.listenArrowKeys = true;
    });
  }

  openDamageFormDialog(creature: Creature): void {
    this.listenArrowKeys = false;
    let dialogRef = this.dialog.open(DamageFormComponent, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(dmg => {
      this.listenArrowKeys = true;
      if (dmg !== undefined) {
        this.initiativeService.damage(creature, dmg);
      }
    });
  }

  openConditionFormDialog(creature: Creature): void {
    this.listenArrowKeys = false;
    let dialogRef = this.dialog.open(ConditionFormComponent, {
      width: '500px'
    });
    dialogRef.afterClosed().subscribe(condition => {
      this.listenArrowKeys = true;
      if (condition !== undefined) {
        this.initiativeService.applyCondition(creature, condition);
      }
    });
  }

  openNoteFormDialog(creature: Creature): void {
    this.listenArrowKeys = false;
    let dialogRef = this.dialog.open(NoteFormComponent, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(note => {
      this.listenArrowKeys = true;
      if (note !== undefined) {
        this.initiativeService.addNote(creature, note);
      }
    });
  }

  openConditionDetailDialog(condition: Condition): void {
    this.listenArrowKeys = false;
    let dialogRef = this.dialog.open(ConditionDetailComponent, {
      width: '400px',
      data: condition
    });
    dialogRef.afterClosed().subscribe(() => this.listenArrowKeys = true);
  }

  rollPerception(creatures: Creature[]): void {
    creatures.forEach(creature => {
      this.badges[creature.id] = this.getRandomInt(1, 20) + creature.perceptionBonus;
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
