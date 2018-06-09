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

  @Input() stats: Object;
  @Input() live: boolean;

  // public stats: Object;

  get basics(): Object {
  	return this.stats['basics'];
  }

  get defense(): Object {
  	return this.stats['defense'];
  }

  get offense(): Object {
  	return this.stats['offense'];
  }

  get spells(): Object {
  	return this.stats['spells'];
  }

  get statistics(): Object {
  	return this.stats['statistics'];
  }

  get extras(): Object {
  	return this.stats['extras'];
  }

  // updatePreview() {
  // 	this.stats = this.form.value;
  // 	this.form.valueChanges.subscribe(() => {
  // 		this.stats = this.form.value;
  // 	});
  // }

  showAC(): boolean {
  	return this.defense['ac'] || this.defense['acff'] || this.defense['actouch'] || this.defense['acnotes'];
  }

  showOffense(): boolean {
  	let offense = this.offense['speed'] || this.offense['space'] || this.offense['reach'] || this.offense['attacks'].length;
  	let spells = this.spells['slaLevels'].length || this.spells['spellLevels'].length;
  	return offense || spells;
  }

  get meleeAttacks(): Object[] {
  	return this.offense['attacks'].filter(attack => attack.type == 'melee');
  }

  get rangedAttacks(): Object[] {
  	return this.offense['attacks'].filter(attack => attack.type == 'ranged');
  }

  get specialAttacks(): Object[] {
  	return this.offense['attacks'].filter(attack => attack.type == 'special');
  }

  get sortedSlaLevels(): Object[] {
  	return (this.spells['slaLevels'] as Object[]).sort((a, b) => {
  		if (a['limited'] == 'Constant') return -1;
  		if (b['limited'] == 'Constant') return 1;
  		if (a['limited'] == 'At will') return -1;
  		if (b['limited'] == 'At will') return 1;
  		return b['uses'] - a['uses'];
  	});
  }

  get sortedSpellLevels(): Object[] {
  	return (this.spells['spellLevels'] as Object[]).sort(function(a, b) {
  		return b['level'] - a['level'];
  	});
  }

}
