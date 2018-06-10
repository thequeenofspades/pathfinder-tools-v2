import { Component, OnInit, Input } from '@angular/core';
import { Monster } from '../monster';
import { InitiativeService } from '../initiative.service';

@Component({
  selector: 'app-interactive-sla-list',
  templateUrl: './interactive-sla-list.component.html',
  styleUrls: ['./interactive-sla-list.component.scss']
})
export class InteractiveSlaListComponent implements OnInit {

  constructor(private is: InitiativeService) { }

  ngOnInit() {
  	this.showUses = (this.limited == 'Limited');
  }

  @Input() slas: {name: string, uses: number}[];
  @Input() limited: string;
  @Input() monster: Monster;

  showUses: boolean;

  cast(i: number) {
  	if (this.showUses) {
  		this.slas[i].uses -= 1;
  		this.is.update(this.monster);
  	}
  }

  addUse(i: number) {
  	this.slas[i].uses = this.slas[i].uses + 1;
  	this.is.update(this.monster);
  }

}
