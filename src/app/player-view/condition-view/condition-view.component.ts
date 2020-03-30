import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ConditionFormComponent } from '../condition-form/condition-form.component';
import { InitiativeService, PlayerOptions } from '../../dashboard/initiative.service';
import { Creature } from '../../dashboard/monster';
import { Condition } from '../../dashboard/condition';

@Component({
  selector: 'app-condition-view',
  templateUrl: './condition-view.component.html',
  styleUrls: ['./condition-view.component.scss']
})
export class ConditionViewComponent implements OnInit {

  constructor(public dialog: MatDialog,
    public initService: InitiativeService) { }

  ngOnInit() {
  }

  public focusedConditionId : string;

  openConditionFormDialog(condition?: Condition): void {
    let dialogRef = this.dialog.open(ConditionFormComponent, {
      width: '500px',
      data: {
        condition: condition,
        initService: this.initService,
        playerView: true
      }
    });
    dialogRef.afterClosed().subscribe(newCondition => {
      if (newCondition !== undefined && condition == undefined) {
        newCondition.playerVisible = 2;
        this.initService.addCondition(newCondition);
      } else if (newCondition != undefined) {
      	this.initService.updateCondition({...newCondition, id: condition.id, color: condition.color});
      }
    });
  }

  clearConditions(): void {
    this.initService.clearConditions();
  }

  removeCondition(condition: Condition): void {
  	this.initService.removeCondition(condition);
  }

  rerollColor(condition: Condition): void {
  	this.initService.changeConditionColor(condition);
  }

  conditionTrackByFn(index, condition) {
    return condition.color;
  }

  sortedConditions(conditions: Condition[]): Condition[] {
    return conditions.sort((a, b) => {
      return a.permanent || a.playerVisible < 2 ? 1 : b.permanent || b.playerVisible < 2 ? -1 : a.duration - b.duration;
    }).filter(condition => {
      return condition.playerVisible == undefined || condition.playerVisible > 0;
    });
  }

  mouseoverCondition(condition: Condition) {
    this.focusedConditionId = condition.id;
  }

  mouseoutCondition() {
    this.focusedConditionId = undefined;
  }

}
