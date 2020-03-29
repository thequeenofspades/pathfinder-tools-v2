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

  @Input() buffs: Condition[];
  @Input() creature: Creature;
  @Output() clickEvent = new EventEmitter<Condition>();

  click(condition: Condition) {
  	this.clickEvent.emit(condition);
  }

  removeCondition(condition: Condition) {
    this.is.removeBuffFromCreature(condition, this.creature);
  }

  getBuffs(creature: Creature): Condition[] {
    return (this.buffs || []).filter(buff => {
      return (buff.affected || []).find(cr => cr.id == creature.id);
    });
  }

  buffTrackByFn(index, buff) {
    return buff.color;
  }

}
