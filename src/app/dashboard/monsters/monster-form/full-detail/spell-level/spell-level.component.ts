import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { EncounterService } from '../../../../encounter.service';

@Component({
  selector: 'app-monster-form-spell-level',
  templateUrl: './spell-level.component.html',
  styleUrls: ['./spell-level.component.css']
})
export class SpellLevelComponent implements OnInit {

  constructor(private fb: FormBuilder, private es: EncounterService) { }

  ngOnInit() {
  }

  @Input() form: FormGroup;
  @Output() remove = new EventEmitter();

  get spells(): FormArray {
  	return this.form.get('spells') as FormArray;
  }

  addSpell() {
    this.spells.push(this.es.buildSpellFormGroup());
  }

  addSpellChip(event: MatChipInputEvent) {
  	if (event.value.trim().length) {
      let newSpell = this.es.buildSpellFormGroup();
      newSpell.patchValue({name: event.value.trim()});
      this.spells.push(newSpell);
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
