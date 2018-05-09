import { Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

import { Player } from '../../player';
import { Monster } from '../../monster';
import { InitiativeService } from '../../initiative.service';
import { Condition } from '../condition';

import { NoteFormComponent } from './note-form.component';
import { ConditionFormComponent } from './condition-form.component';
import { DamageFormComponent } from './damage-form.component';

type Creature = Player | Monster;

@Component({
  selector: 'app-initiative-order',
  templateUrl: './initiative-order.component.html',
  styleUrls: ['./initiative-order.component.css']
})
export class InitiativeOrderComponent implements OnInit {

  constructor(private initiativeService: InitiativeService,
    public dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {
      matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('assets/mdi.svg'));
  }

  ngOnInit() {
  	this.getOrder();
  	this.getActive();
  	this.getRound();
  }

  order: Creature[];

  active: number;

  round: number;

  selectedCreature: Creature;

  private getActive(): void {
  	// Get index of active creature
  	this.initiativeService.getActive()
  		.subscribe(idx => {
        this.active = idx;
        this.selectedCreature = this.order[this.active];
      });
  }

  private getOrder(): void {
  	this.initiativeService.getOrder()
  		.subscribe(order => this.order = order);
  }

  private getRound(): void {
  	this.initiativeService.getRound()
  		.subscribe(round => this.round = round);
  }

  selectCreature(creature: Creature): void {
    if (this.selectedCreature == creature) {
      this.selectedCreature = null;
    } else {
      this.selectedCreature = creature;
    }
  }

  openDamageFormDialog(creature: Creature): void {
    let dialogRef = this.dialog.open(DamageFormComponent, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(dmg => {
      if (dmg !== undefined) {
        this.damage(creature, dmg);
      }
    });
  }

  openConditionFormDialog(creature: Creature): void {
    let dialogRef = this.dialog.open(ConditionFormComponent, {
      width: '500px'
    });
    dialogRef.afterClosed().subscribe(condition => {
      if (condition !== undefined) {
        this.addCondition(creature, condition);
      }
    });
  }

  openNoteFormDialog(creature: Creature): void {
    let dialogRef = this.dialog.open(NoteFormComponent, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(note => {
      if (note !== undefined) {
        this.addNote(creature, note);
      }
    });
  } 

  previous(): void {
  	this.initiativeService.previous()
  		.subscribe(idx => this.active = idx);
  	this.getRound();
    this.selectedCreature = this.order[this.active];
  }

  advance(): void {
  	this.initiativeService.advance()
  		.subscribe(idx => this.active = idx);
  	this.getRound();
    this.selectedCreature = this.order[this.active]
  }

  remove(creature: Creature): void {
  	this.initiativeService.remove(creature)
  		.subscribe(order => this.order = order);
  }

  damage(creature: Creature, damage: number): void {
  	this.initiativeService.damage(creature, damage)
  		.subscribe(order => this.order = order);
  }

  addCondition(creature: Creature, condition: Condition): void {
  	this.initiativeService.addCondition(creature, condition)
  		.subscribe(order => this.order = order);
  }

  removeCondition(creature: Creature, condition: Condition): void {
    this.initiativeService.removeCondition(creature, condition)
      .subscribe(order => this.order = order);
  }

  addNote(creature: Creature, note: string): void {
  	this.initiativeService.addNote(creature, note)
  		.subscribe(order => this.order = order);
  }

  removeNote(creature: Creature, note: string): void {
    this.initiativeService.removeNote(creature, note)
      .subscribe(order => this.order = order);
  }

  clear(): void {
  	this.initiativeService.clear()
  		.subscribe(order => this.order = order);
  	this.getRound();
  }

  moveUp(creature: Creature): void {
  	this.initiativeService.moveUp(creature)
  		.subscribe(order => this.order = order);
  }

  moveDown(creature: Creature): void {
  	this.initiativeService.moveDown(creature)
  		.subscribe(order => this.order = order);
  }

  adjusted(creature: Creature): boolean {
  	return creature.attributes.some(a => a == "moved");
  }

  delay(creature: Creature): void {
  	this.initiativeService.delay(creature)
  		.subscribe(order => this.order = order);
  	this.getActive();
  	this.getRound();
  }

  undelay(creature: Creature): void {
  	this.initiativeService.undelay(creature)
  		.subscribe(order => this.order = order);
  	this.getActive();
  	this.getRound();
  }

  delayed(creature: Creature): boolean {
  	return creature.attributes.some(a => a == "delayed");
  }

}
