import { Component, OnInit, Input } from '@angular/core';
import { Monster } from '../monster';
import { InitiativeService } from '../initiative.service';

@Component({
  selector: 'app-interactive-spell-list',
  templateUrl: './interactive-spell-list.component.html',
  styleUrls: ['./interactive-spell-list.component.scss']
})
export class InteractiveSpellListComponent implements OnInit {

  constructor(private is: InitiativeService) { }

  ngOnInit() {
  }

  @Input() spellLevel: {
    uses: number,
    level: number,
    spells: {
      name: string,
      cast: boolean
    }[]
  };
  @Input() monster: Monster;

  get showUses(): boolean {
    return this.spellLevel.uses != undefined;
  }

  cast(i: number) {
  	if (this.spellLevel.uses == undefined && this.spellLevel.level > 0) {
	  	this.spellLevel.spells[i].cast = !this.spellLevel.spells[i].cast;
      this.is.update(this.monster);
  	} else if (this.spellLevel.level > 0) {
  		this.spellLevel.uses -= 1;
      this.is.update(this.monster);
  	}
  }

  addUse() {
  	this.spellLevel.uses += 1;
    this.is.update(this.monster);
  }

}
