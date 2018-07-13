import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { InitiativeService } from '../dashboard/initiative.service';
import { Creature } from '../dashboard/monster';

interface Buff {
  name: string,
  color: string,
  affected: Creature[],
  initiative: number
};

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.scss'],
  providers: [ InitiativeService ]
})
export class PlayerViewComponent implements OnInit {

  constructor(public initiativeService: InitiativeService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe((data: {id: string}) => {
      this.initiativeService.setup(data.id);
    });
  }

  getBuffs(creature: Creature, buffs: Buff[]): {color: string, name: string}[] {
    return (buffs || []).filter(buff => {
      return (buff.affected || []).find(cr => cr.id == creature.id);
    }).map(buff => {
      return {name: buff.name, color: buff.color};
    });
  }

  getBuffDecrements(order: {initiative: number}[], i: number, buffs: Buff[]): {color: string, name: string}[] {
    return (buffs || []).filter(buff => {
      let prev = i - 1;
      if (prev < 0) {
        if (order[i].initiative < buff.initiative) {
          return true;
        }
      } else if (order[prev].initiative > buff.initiative && order[i].initiative <= buff.initiative) {
        return true;
      }
      return false;
    }).map(buff => {
      return {name: buff.name, color: buff.color};
    });
  }

  buffTrackByFn(index, buff) {
    return buff.color;
  }

  adjusted(creature: any): boolean {
  	return creature.attributes.some(a => a == "moved");
  }

  delayed(creature: any): boolean {
  	return creature.attributes.some(a => a == "delayed");
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
