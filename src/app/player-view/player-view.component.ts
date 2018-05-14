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

}
