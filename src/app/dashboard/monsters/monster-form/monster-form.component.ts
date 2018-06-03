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
  @Output() onSubmitted = new EventEmitter<Object>();
  @Output() onCanceled = new EventEmitter();

  monsterForm : FormGroup;
  showQuantity: boolean = true;

  createForm(): void {
    this.monsterForm = this.fb.group({
      name: [this.model.name, Validators.required],
      hp: [this.model.hp, Validators.required],
      conScore: [this.model.conScore, Validators.required],
      initiativeBonus: [this.model.initiativeBonus, Validators.required],
      perceptionBonus: [this.model.perceptionBonus, Validators.required],
      senseMotiveBonus: [this.model.senseMotiveBonus, Validators.required],
      quantity: [this.model.quantity, Validators.required]
    });
    if (this.model.name != '') {
      this.monsterForm.get('quantity').clearValidators();
      this.showQuantity = false;
    };
  }

  onCancel() {
  	this.onCanceled.emit();
  }

  onSubmit() {
    let form = this.monsterForm;
    let monster = {
      name: form.get('name').value,
      hp: form.get('hp').value,
      initiativeBonus: form.get('initiativeBonus').value,
      perceptionBonus: form.get('perceptionBonus').value,
      senseMotiveBonus: form.get('senseMotiveBonus').value,
      conScore: form.get('conScore').value,
      quantity: form.get('quantity').value
    };
    this.onSubmitted.emit(monster);
  }

}
