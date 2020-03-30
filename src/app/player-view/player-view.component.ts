import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { InitiativeService, ShowNamesOption, PlayerOptions } from '../dashboard/initiative.service';
import { Creature, MonsterI } from '../dashboard/monster';
import { ConditionViewComponent } from './condition-view/condition-view.component';
import { Condition } from '../dashboard/condition';

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.scss'],
  providers: [ InitiativeService ]
})
export class PlayerViewComponent implements OnInit {

  private activeImageUrl : string;

  constructor(public initiativeService: InitiativeService,
    private route: ActivatedRoute) { }

  @ViewChild(ConditionViewComponent) public conditionViewComponent: ConditionViewComponent;

  ngOnInit() {
    this.route.data.subscribe((data: {id: string}) => {
      this.initiativeService.setup(data.id);
    });
  }

  /* Return the index of the current active creature in the initiative order.
   * If there are no creatures currently visible, return 0.
   * If the active creature is invisible, return the closest visible creature in the initiative.
   */
  getActive(order: {id: string, initiative: number, hp: number, visible: boolean, imageUrl: string}[],
            active: number): {idx: number, imageUrl: string} {
    let init = order[active].initiative;
    let filteredOrder = order.filter(c => c.hp == undefined || c.visible);
    if (filteredOrder.length == 0) return {idx: 0, imageUrl: ''};
    let idx = filteredOrder.findIndex(c => c.initiative < init) - 1;
    if (idx < 0) idx = filteredOrder.length - 1;
    this.activeImageUrl = filteredOrder[idx].imageUrl;
    let activeCreatureIdx = order.findIndex(c => c.id == filteredOrder[idx].id);
    let activeCreature = order[activeCreatureIdx];
    return {idx: activeCreatureIdx, imageUrl: activeCreature.imageUrl};
  }

  getConditions(creature: Creature, conditions: Condition[]): Condition[] {
    return (conditions || []).filter(condition => {
      return (condition.affected || []).find(cr => cr.id == creature.id);
    }).filter(condition => {
      return condition.playerVisible == undefined || condition.playerVisible > 0;
    });
  }

  getConditionDecrements(order: {initiative: number, id: string, hp: number, visible: boolean}[],
                    i: number,
                    conditions: Condition[]): Condition[] {
    let id = order[i].id;
    order = order.filter(c => c.hp == undefined || c.visible);
    i = order.findIndex(c => c.id == id);
    return (conditions || []).filter(condition => {
      let prev = i - 1;
      if (prev < 0) {
        if (order[i].initiative <= condition.initiative) {
          return true;
        }
      } else if (order[prev].initiative > condition.initiative && order[i].initiative <= condition.initiative) {
        return true;
      }
      return false;
    });
  }

  getDisplayName(monster: MonsterI, playerOptions: PlayerOptions): string {
    if (!playerOptions || playerOptions.nameOption == ShowNamesOption.NoShow) {
      return `Monster`;
    }
    return monster.basics.name;
  }

  getDisplayIdx(monster: MonsterI, playerOptions: PlayerOptions): string {
    if (!playerOptions || playerOptions.nameOption != ShowNamesOption.ShowNameAndNumber) {
      return "";
    }
    return `(${monster.basics.idx})`;
  }

  mouseoverCondition(condition: Condition) {
    this.conditionViewComponent.focusedConditionId = condition.id;
  }

  mouseoutCondition() {
    this.conditionViewComponent.focusedConditionId = undefined;
  }

  conditionTrackByFn(index, condition: Condition) {
    return condition.color;
  }

  healthCategory(percent: number): string {
    if (percent >= 98) {
      return 'Uninjured';
    } else if (percent >= 80) {
      return 'Barely injured';
    } else if (percent >= 50) {
      return 'Injured';
    } else if (percent >= 15) {
      return 'Badly wounded';
    } else if (percent > 0) {
      return 'Near death';
    } else {
      return 'Dead';
    }
  }

  bloodied(percent: number): string {
    if (percent > 50) {
      return 'Healthy';
    } else if (percent > 0) {
      return 'Bloodied';
    } else {
      return 'Dead';
    }
  }

}
