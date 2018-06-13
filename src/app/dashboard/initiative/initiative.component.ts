import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { InitiativeService } from '../initiative.service';

@Component({
  selector: 'app-initiative',
  templateUrl: './initiative.component.html',
  styleUrls: ['./initiative.component.css'],
  providers: [InitiativeService]
})
export class InitiativeComponent implements OnInit {

  constructor(public initiativeService: InitiativeService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe((data: {id: string}) => {
      this.code = data.id;
      this.initiativeService.setup(data.id);
    });
  }

  public code: string;

}
