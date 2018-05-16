import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { InitiativeService } from '../dashboard/initiative.service';

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.css'],
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
