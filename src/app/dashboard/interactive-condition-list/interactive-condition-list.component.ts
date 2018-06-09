import { Component, OnInit, Input } from '@angular/core';

import { Creature } from '../monster';
import { Condition } from '../condition';
import { InitiativeService } from '../initiative.service';

@Component({
  selector: 'app-interactive-condition-list',
  templateUrl: './interactive-condition-list.component.html',
  styleUrls: ['./interactive-condition-list.component.scss']
})
export class InteractiveConditionListComponent implements OnInit {

  constructor(private is: InitiativeService) { }

  ngOnInit() {
  }

  @Input() creature: Creature;
  @Input() conditions: Condition[];

  removeCondition(creature: Creature, condition: Condition) {
  	this.is.removeCondition(creature, condition);
  }

}
