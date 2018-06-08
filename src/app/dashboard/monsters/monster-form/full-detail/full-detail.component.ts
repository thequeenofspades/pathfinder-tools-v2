import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-monster-form-full-detail',
  templateUrl: './full-detail.component.html',
  styleUrls: ['./full-detail.component.css']
})
export class FullDetailComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

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
  	let newClass = this.fb.group({
  		class: ['', Validators.required],
  		level: ''
  	});
  	this.classes.push(newClass);
  }

  removeClass(i: number) {
  	this.classes.removeAt(i);
  }

  addAttack() {
  	let newAttack = this.fb.group({
  		attack: ['', Validators.required],
  		type: ['melee', Validators.required]
  	});
  	this.attacks.push(newAttack);
  }

  removeAttack(i: number) {
  	this.attacks.removeAt(i);
  }

  addSLALevel() {
    let newSLALevel = this.fb.group({
      limited: 'Limited',
      uses: [0, Validators.required],
      slas: this.fb.array([])
    });
    newSLALevel.get('limited').valueChanges.subscribe(limited => {
      if (limited == 'At will' || limited == 'Constant') {
        newSLALevel.get('uses').setValidators([]);
        newSLALevel.get('uses').disable();
      } else {
        newSLALevel.get('uses').setValidators([Validators.required]);
        newSLALevel.get('uses').enable();
      }
    });
    this.slaLevels.push(newSLALevel);
  }

  removeSLALevel(i: number) {
  	this.slaLevels.removeAt(i);
  }

  addSpellLevel() {
    let newSpellLevel = this.fb.group({
      level: [this.spellLevels.length, Validators.required],
      uses: 0,
      spells: this.fb.array([])
    });
    if (!newSpellLevel.get('level') || !this.form.get('spells.spontaneous').value) {
      newSpellLevel.get('uses').disable();
    }
    this.form.get('spells.spontaneous').valueChanges.subscribe(data => this.updateSpellUses(newSpellLevel));
    newSpellLevel.get('level').valueChanges.subscribe(data => this.updateSpellUses(newSpellLevel));
    this.spellLevels.push(newSpellLevel);
  }

  updateSpellUses(spellLevel: FormGroup) {
  	if (this.form.get('spells.spontaneous').value && spellLevel.get('level').value != 0) {
  	  spellLevel.get('uses').setValidators([Validators.required]);
      spellLevel.get('uses').enable();
    } else {
	  spellLevel.get('uses').setValidators([]);
	  spellLevel.get('uses').disable();
	}
  }

  removeSpellLevel(i: number) {
  	this.spellLevels.removeAt(i);
  }

  addSpecial() {
  	let newSpecial = this.fb.group({
  		name: ['', Validators.required],
  		type: '',
  		description: ''
  	});
  	this.specials.push(newSpecial);
  }

  removeSpecial(i: number) {
  	this.specials.removeAt(i);
  }

}
