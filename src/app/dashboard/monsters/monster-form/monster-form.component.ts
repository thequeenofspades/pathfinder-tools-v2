import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Monster } from '../../monster';

@Component({
  selector: 'app-monster-form',
  templateUrl: './monster-form.component.html',
  styleUrls: ['./monster-form.component.css']
})
export class MonsterFormComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();
  }

  @Input() model: Monster = new Monster('', 100);
  @Output() onSubmitted = new EventEmitter<Monster>();
  @Output() onCanceled = new EventEmitter();

  monsterForm : FormGroup;

  createForm(): void {
    this.monsterForm = this.fb.group({
      name: [this.model.name, Validators.required],
      hp: [this.model.hp, Validators.required],
      conScore: [this.model.conScore, Validators.required],
      initiativeBonus: [this.model.initiativeBonus, Validators.required],
      perceptionBonus: [this.model.perceptionBonus, Validators.required],
      quantity: [this.model.quantity, Validators.required]
    })
  }

  onCancel() {
  	this.onCanceled.emit();
  }

  onSubmit() {
    let form = this.monsterForm;
    let monster = new Monster(
      form.get('name').value,
      form.get('hp').value,
      form.get('initiativeBonus').value,
      form.get('perceptionBonus').value);
    monster.conScore = form.get('conScore').value;
    monster.quantity = form.get('quantity').value;
    this.onSubmitted.emit(monster);
  }

}
