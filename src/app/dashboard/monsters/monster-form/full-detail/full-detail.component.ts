import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { EncounterService } from '../../../encounter.service';

@Component({
  selector: 'app-monster-form-full-detail',
  templateUrl: './full-detail.component.html',
  styleUrls: ['./full-detail.component.css']
})
export class FullDetailComponent implements OnInit {

  constructor(private fb: FormBuilder, private es: EncounterService) { }

  ngOnInit() {
  }

  @Input() public form: FormGroup;
  @Input() public showQuantity: boolean;
  @Output() public cancel = new EventEmitter();
  @Output() public submit = new EventEmitter();

  public attackTypes = ['melee', 'ranged', 'special'];
  public specialTypes = ['Ex', 'Su', 'Sp'];

  onCancel() {
  	this.cancel.emit();
  }

  onSubmit() {
  	this.submit.emit();
  }

  abilityBonus(score: number): number {
    return Math.floor((score - 10) / 2);
  }

  get classes(): FormArray {
  	return this.form.get('basics.classes') as FormArray;
  }

  get attacks(): FormArray {
  	return this.form.get('offense.attacks') as FormArray;
  }

  get slaLevels(): FormArray {
    return this.form.get('spells.slaLevels') as FormArray;
  }

  get spellLevels(): FormArray {
    return this.form.get('spells.spellLevels') as FormArray;
  }

  get specials(): FormArray {
  	return this.form.get('extras.specials') as FormArray;
  }

  addClass() {
  	this.classes.push(this.es.buildClassFormGroup());
  }

  removeClass(i: number) {
  	this.classes.removeAt(i);
  }

  addAttack() {
  	this.attacks.push(this.es.buildAttackFormGroup());
  }

  removeAttack(i: number) {
  	this.attacks.removeAt(i);
  }

  addSLALevel() {
    this.slaLevels.push(this.es.buildSlaLevelFormGroup());
  }

  removeSLALevel(i: number) {
  	this.slaLevels.removeAt(i);
  }

  addSpellLevel() {
    this.spellLevels.push(this.es.buildSpellLevelFormGroup(this.form.get('spells') as FormGroup));
  }

  removeSpellLevel(i: number) {
  	this.spellLevels.removeAt(i);
  }

  addSpecial() {
  	this.specials.push(this.es.buildSpecialFormGroup());
  }

  removeSpecial(i: number) {
  	this.specials.removeAt(i);
  }

}
