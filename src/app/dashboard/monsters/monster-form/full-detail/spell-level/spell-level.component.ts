import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import {MatChipInputEvent} from '@angular/material';

@Component({
  selector: 'app-monster-form-spell-level',
  templateUrl: './spell-level.component.html',
  styleUrls: ['./spell-level.component.css']
})
export class SpellLevelComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

  @Input() form: FormGroup;
  @Output() remove = new EventEmitter();

  get spells(): FormArray {
  	return this.form.get('spells') as FormArray;
  }

  addSpell() {
    let newSpell = this.fb.group({
      name: ['', Validators.required],
      dc: ''
    });
    this.spells.push(newSpell);
  }

  addSpellChip(event: MatChipInputEvent) {
  	if (event.value.trim().length) {
	  this.spells.push(this.fb.group({name: event.value.trim()}));
	}
  	if (event.input) event.input.value = '';
  }

  removeSpell(i: number) {
  	this.spells.removeAt(i);
  }

  removeSpellLevel() {
  	this.remove.emit();
  }

}
