import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

import { Player } from '../../../player';

@Component({
  selector: 'app-player-form',
  templateUrl: './player-form.component.html',
  styleUrls: ['./player-form.component.css']
})
export class PlayerFormComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  	this.model = Object.assign({}, this.model);
  }

  @Input() model: Player = new Player('');
  @Output() onSubmitted = new EventEmitter<Player>();
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
  	this.model = new Player('');
  }

}
