import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { EncounterService } from '../../encounter.service';

import { Monster, MonsterI } from '../../monster';

@Component({
  selector: 'app-monster-form',
  templateUrl: './monster-form.component.html',
  styleUrls: ['./monster-form.component.css']
})
export class MonsterFormComponent implements OnInit {

  constructor(private fb: FormBuilder, private es: EncounterService) { }

  ngOnInit() {
    this.createForm();
  }

  @Input() model: MonsterI;
  @Output() onSubmitted = new EventEmitter<MonsterI>();
  @Output() onCanceled = new EventEmitter();

  form: FormGroup;
  showQuantity: boolean = true;

  createForm(): void {
    this.resetForm();
    if (this.model) {
      this.form.get('basics.quantity').clearValidators();
      this.form.get('basics.idx').setValidators([Validators.required]);
      this.showQuantity = false;
    };
  }

  resetForm(): void {
    this.form = this.es.buildMonsterForm();
    if (this.model) {
      this.es.setMonsterFormValue(this.model, this.form);
    }
  }

  onCancel() {
    this.resetForm();
  	this.onCanceled.emit();
  }

  onSubmit() {
    this.onSubmitted.emit(this.form.value);
    this.resetForm();
  }

  abilityBonus(score: number): number {
    return Math.floor((score - 10) / 2);
  }

}
