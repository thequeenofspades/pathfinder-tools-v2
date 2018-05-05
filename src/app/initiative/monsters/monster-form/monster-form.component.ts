import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

import { Monster } from '../../../monster';

@Component({
  selector: 'app-monster-form',
  templateUrl: './monster-form.component.html',
  styleUrls: ['./monster-form.component.css']
})
export class MonsterFormComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  	this.model = Object.assign({}, this.model);
  }

  @Input() model: Monster = new Monster('', 100);
  @Output() onSubmitted = new EventEmitter<Monster>();
  @Output() onCanceled = new EventEmitter();

  onCancel() {
  	this.resetPlayer();
  	this.onCanceled.emit();
  }

  onSubmit() {
  	this.onSubmitted.emit(this.model);
  	this.resetPlayer();
  }

  resetPlayer() {
  	this.model = new Monster('', 100);
  }

}
