import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Creature } from '../monster';
import { Condition } from '../condition';
import { InitiativeService } from '../initiative.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-interactive-condition-list',
  templateUrl: './interactive-condition-list.component.html',
  styleUrls: ['./interactive-condition-list.component.scss']
})
export class InteractiveConditionListComponent implements OnInit {

  constructor(public is: InitiativeService) { }

  ngOnInit() {
  }

  @Input() conditions: Condition[];
  @Input() creature: Creature;
  @Output() clickEvent = new EventEmitter<Condition>();
  @Output() editEvent = new EventEmitter<Condition>();

  changeColor(condition: Condition) {
    this.is.changeConditionColor(condition);
  }

  click(condition: Condition) {
  	this.clickEvent.emit(condition);
  }

  editCondition(condition: Condition) {
    this.editEvent.emit(condition);
  }

  removeCondition(condition: Condition) {
    this.is.removeConditionFromCreature(condition, this.creature);
  }

  getConditions(creature: Creature): Condition[] {
    return (this.conditions || []).filter(condition => {
      return (condition.affected || []).find(cr => cr.id == creature.id);
    });
  }

  conditionTrackByFn(index, condition) {
    return condition.color;
  }

}
