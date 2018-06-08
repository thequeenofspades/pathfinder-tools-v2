import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { Monster, MonsterI } from '../../monster';

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

  @Input() model: MonsterI;
  @Output() onSubmitted = new EventEmitter<MonsterI>();
  @Output() onCanceled = new EventEmitter();

  form: FormGroup;
  showQuantity: boolean = true;
  fullStats: FormControl;

  createForm(): void {
    this.fullStats = new FormControl();
    this.resetForm();
    if (this.model) {
      this.form.get('basics.quantity').clearValidators();
      this.form.get('basics.idx').setValidators([Validators.required]);
      this.showQuantity = false;
    };
  }

  resetForm(): void {
    this.form = this.fb.group({
      id: '',
      basics: this.fb.group({
        name: ['', Validators.required],
        quantity: [1, Validators.required],
        idx: 1,
        gender: '',
        race: '',
        classes: this.fb.array([]),
        alignment: '',
        size: '',
        type: '',
        initiativeBonus: ['', Validators.required],
        senses: '',
        perceptionBonus: '',
        aura: ''
      }),
      statistics: this.fb.group({
        strScore: '',
        dexScore: '',
        conScore: ['', Validators.required],
        intScore: '',
        wisScore: '',
        chaScore: '',
        bab: '',
        cmb: '',
        cmd: '',
        feats: '',
        skills: '',
        languages: '',
        sq: ''
      }),
      defense: this.fb.group({
        ac: '',
        acff: '',
        actouch: '',
        acnotes: '',
        hp: ['', Validators.required],
        hpnotes: '',
        fort: '',
        ref: '',
        will: '',
        savenotes: '',
        defensiveAbilities: '',
        resistances: '',
        immunities: '',
        dr: '',
        sr: '',
        weaknesses: ''
      }),
      offense: this.fb.group({
        speed: '',
        attacks: this.fb.array([]),
        space: '',
        reach: ''
      }),
      spells: this.fb.group({
        slaLevels: this.fb.array([]),
        slaCL: '',
        slaConcentration: '',
        spontaneous: false,
        spellLevels: this.fb.array([]),
        cl: '',
        concentration: ''
      }),
      extras: this.fb.group({
        specials: this.fb.array([]),
        gear: '',
        description: '',
        cr: '',
        xp: '',
        tactics: ''
      })
    });
    if (this.model) {
      this.form.setValue(this.model);
    }
  }

  get slas(): FormArray {
    return this.form.get('spells.slas') as FormArray;
  }

  get spellLevels(): FormArray {
    return this.form.get('spells.spellLevels') as FormArray;
  }

  addSLA() {
    let newSLA = this.fb.group({
      name: ['', Validators.required],
      atWill: false,
      uses: [0, Validators.required],
      dc: ''
    });
    newSLA.get('atWill').valueChanges.subscribe(atWill => {
      if (atWill) {
        newSLA.get('uses').setValidators([]);
        newSLA.get('uses').disable();
      } else {
        newSLA.get('uses').setValidators([Validators.required]);
        newSLA.get('uses').enable();
      }
    });
    this.slas.push(newSLA);
  }

  addSpellLevel() {
    let newSpellLevel = this.fb.group({
      level: [this.spellLevels.length, Validators.required],
      uses: 0,
      spells: this.fb.array([])
    });
    newSpellLevel.get('uses').disable();
    this.form.get('spells.spontaneous').valueChanges.subscribe(spontaneous => {
      if (spontaneous) {
        newSpellLevel.get('uses').setValidators([Validators.required]);
        newSpellLevel.get('uses').enable();
      } else {
        newSpellLevel.get('uses').setValidators([]);
        newSpellLevel.get('uses').disable();
      }
    });
    this.spellLevels.push(newSpellLevel);
  }

  addSpell(level: number) {
    let newSpell = this.fb.group({
      name: ['', Validators.required],
      timesPrepared: [1, Validators.required],
      dc: ''
    });
    this.form.get('spells.spontaneous').valueChanges.subscribe(spontaneous => {
      if (spontaneous) {
        newSpell.get('timesPrepared').setValidators([]);
        newSpell.get('timesPrepared').disable();
      } else {
        newSpell.get('timesPrepared').setValidators([Validators.required]);
        newSpell.get('timesPrepared').enable();
      }
    });
    (this.spellLevels.controls[level].get('spells') as FormArray).push(newSpell);
  }

  onCancel() {
    this.resetForm();
  	this.onCanceled.emit();
  }

  onSubmit() {
    // let form = this.form;
    // let monster = form.value;
    // let monster = {
    //   name: form.get('name').value,
    //   hp: form.get('hp').value,
    //   initiativeBonus: form.get('initiativeBonus').value,
    //   perceptionBonus: form.get('perceptionBonus').value,
    //   senseMotiveBonus: form.get('senseMotiveBonus').value,
    //   conScore: form.get('conScore').value,
    //   quantity: form.get('quantity').value,
    //   idx: form.get('idx').value
    // };
    this.onSubmitted.emit(this.form.value);
    this.resetForm();
  }

  abilityBonus(score: number): number {
    return Math.floor((score - 10) / 2);
  }

}
