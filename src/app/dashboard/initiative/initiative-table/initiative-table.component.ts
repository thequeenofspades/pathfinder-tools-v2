import { Component, OnInit, Input, ViewChild, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AngularFireStorage } from '@angular/fire/storage';

import { InitiativeService } from '../../initiative.service';
import { Creature } from '../../monster';
import { Condition } from '../../condition';

import { DamageFormComponent } from '../damage-form.component';
import { ConditionDetailComponent } from '../condition-detail/condition-detail.component';
import { CreatureDetailComponent } from '../creature-detail/creature-detail.component';
import { CreaturePopoutComponent } from '../creature-detail/creature-popout.component';
import { ConditionFormComponent } from '../../../player-view/condition-form/condition-form.component';

@Component({
  selector: 'app-initiative-table',
  templateUrl: './initiative-table.component.html',
  styleUrls: ['./initiative-table.component.scss']
})
export class InitiativeTableComponent implements OnInit {
  constructor(public dialog: MatDialog, private storage: AngularFireStorage) { }

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
      height: 'auto',
      width: 'auto',
      panelClass: 'creature-popout-pane',
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

  openConditionFormDialog(creature: Creature, condition: Condition = undefined): void {
    this.listenArrowKeys = false;
    let dialogRef = this.dialog.open(ConditionFormComponent, {
      data: {
        condition: condition,
        creature: creature,
        initService: this.initiativeService,
        playerView: false
      },
      width: '500px'
    });
    dialogRef.afterClosed().subscribe(newCondition => {
      if (newCondition !== undefined && condition == undefined) {
        this.initiativeService.addCondition(newCondition);
      } else if (newCondition != undefined) {
      	this.initiativeService.updateCondition({...newCondition, id: condition.id, color: condition.color});
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

  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
