import { Component, OnInit} from '@angular/core';

import { Player } from '../../player';
import { Monster } from '../../monster';
import { InitiativeService } from '../../initiative.service';
import { Condition } from '../condition';

type Creature = Player | Monster;

@Component({
  selector: 'app-initiative-order',
  templateUrl: './initiative-order.component.html',
  styleUrls: ['./initiative-order.component.css']
})
export class InitiativeOrderComponent implements OnInit {

  constructor(private initiativeService: InitiativeService) { }

  ngOnInit() {
  	this.getOrder();
  	this.getActive();
  	this.getRound();
  }

  order: Creature[];

  active: number;

  round: number;

  private getActive(): void {
  	// Get index of active creature
  	this.initiativeService.getActive()
  		.subscribe(idx => this.active = idx);
  }

  private getOrder(): void {
  	this.initiativeService.getOrder()
  		.subscribe(order => this.order = order);
  }

  private getRound(): void {
  	this.initiativeService.getRound()
  		.subscribe(round => this.round = round);
  }

  previous(): void {
  	this.initiativeService.previous()
  		.subscribe(idx => this.active = idx);
  	this.getRound();
  }

  advance(): void {
  	this.initiativeService.advance()
  		.subscribe(idx => this.active = idx);
  	this.getRound();
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

  addNote(creature: Creature, note: string): void {
  	this.initiativeService.addNote(creature, note)
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
