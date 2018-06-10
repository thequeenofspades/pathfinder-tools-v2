import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MonsterI } from '../../../../monster';

@Component({
  selector: 'app-monster-preview',
  templateUrl: './monster-preview.component.html',
  styleUrls: ['./monster-preview.component.css']
})
export class MonsterPreviewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  	// this.updatePreview();
  }

  @Input() stats: MonsterI;
  @Input() live: boolean;

  // public stats: Object;

  get basics() {
  	return this.stats.basics;
  }

  get defense() {
  	return this.stats.defense;
  }

  get offense() {
  	return this.stats.offense;
  }

  get spells() {
  	return this.stats.spells;
  }

  get statistics() {
  	return this.stats.statistics;
  }

  get extras() {
  	return this.stats.extras;
  }

  showAC() {
  	return this.defense.ac || this.defense.acff || this.defense.actouch || this.defense.acnotes;
  }

  showOffense() {
  	let offense = this.offense.speed || this.offense.space || this.offense.reach || this.offense.attacks.length;
  	let spells = this.spells.slaLevels.length || this.spells.spellLevels.length;
  	return offense || spells;
  }

  get meleeAttacks(): Object[] {
  	return this.offense.attacks.filter(attack => attack.type == 'melee');
  }

  get rangedAttacks(): Object[] {
  	return this.offense.attacks.filter(attack => attack.type == 'ranged');
  }

  get specialAttacks(): Object[] {
  	return this.offense.attacks.filter(attack => attack.type == 'special');
  }

  get sortedSlaLevels(): Object[] {
  	return this.spells.slaLevels.sort((a, b) => {
  		if (a.limited == 'Constant') return -1;
  		if (b.limited == 'Constant') return 1;
  		if (a.limited == 'At will') return -1;
  		if (b.limited == 'At will') return 1;
  		return b.uses - a.uses;
  	});
  }

  get sortedSpellLevels(): Object[] {
  	return (this.spells['spellLevels'] as Object[]).sort(function(a, b) {
  		return b['level'] - a['level'];
  	});
  }

}
