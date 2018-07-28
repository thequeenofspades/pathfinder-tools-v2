import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Player } from '../../player';

@Component({
  selector: 'app-player-form',
  templateUrl: './player-form.component.html',
  styleUrls: ['./player-form.component.css']
})
export class PlayerFormComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();
  }

  @Input() model: Player = new Player('');
  @Output() onSubmitted = new EventEmitter<Player>();
  @Output() onCanceled = new EventEmitter();

  playerForm: FormGroup;

  createForm(): void {
    this.playerForm = this.fb.group({
      name: [this.model.name, Validators.required],
      initiativeBonus: [this.model.initiativeBonus, Validators.required],
      perceptionBonus: [this.model.perceptionBonus, Validators.required],
      senseMotiveBonus: [this.model.senseMotiveBonus, Validators.required]
    });
  }

  onCancel() {
    this.createForm();
  	this.onCanceled.emit();
  }

  onSubmit() {
    let player = new Player(this.playerForm.get('name').value);
    player.id = this.model.id;
    player.initiativeBonus = this.playerForm.get('initiativeBonus').value;
    player.perceptionBonus = this.playerForm.get('perceptionBonus').value;
    player.senseMotiveBonus = this.playerForm.get('senseMotiveBonus').value;
    this.createForm();
  	this.onSubmitted.emit(player);
  }
}
