import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { InitiativeService } from '../dashboard/initiative.service';
import { Creature } from '../dashboard/monster';
import { BuffViewComponent } from './buff-view/buff-view.component';
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

  @ViewChild(BuffViewComponent) public buffViewComponent: BuffViewComponent;

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

  getBuffs(creature: Creature, buffs: Condition[]): Condition[] {
    return (buffs || []).filter(buff => {
      return (buff.affected || []).find(cr => cr.id == creature.id);
    }).filter(buff => {
      return buff.playerVisible == undefined || buff.playerVisible > 1;
    });
  }

  getBuffDecrements(order: {initiative: number, id: string, hp: number, visible: boolean}[],
                    i: number,
                    buffs: Condition[]): Condition[] {
    let id = order[i].id;
    order = order.filter(c => c.hp == undefined || c.visible);
    i = order.findIndex(c => c.id == id);
    return (buffs || []).filter(buff => {
      let prev = i - 1;
      if (prev < 0) {
        if (order[i].initiative <= buff.initiative) {
          return true;
        }
      } else if (order[prev].initiative > buff.initiative && order[i].initiative <= buff.initiative) {
        return true;
      }
      return false;
    });
  }

  mouseoverBuff(buff: Condition) {
    this.buffViewComponent.focusedBuffId = buff.id;
  }

  mouseoutBuff() {
    this.buffViewComponent.focusedBuffId = undefined;
  }

  buffTrackByFn(index, buff: Condition) {
    return buff.color;
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
