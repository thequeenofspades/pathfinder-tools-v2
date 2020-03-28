import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
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

  @ViewChildren("spellInput") spellInputs: QueryList<ElementRef>;

  get spells(): FormArray {
  	return this.form.get('spells') as FormArray;
  }

  addSpell() {
    this.spells.push(this.es.buildSpellFormGroup());
  }

  tokenEnd(event: MatChipInputEvent) {
  	this.addSpellChip(event.value);
    if (event.input) event.input.value = '';
  }

  addSpellChip(value: string): void {
    if (value.trim().length) {
      let newSpell = this.es.buildSpellFormGroup();
      newSpell.patchValue({name: value.trim()});
      this.spells.push(newSpell);
    }
  }

  removeSpell(i: number) {
  	this.spells.removeAt(i);
  }

  removeSpellLevel() {
  	this.remove.emit();
  }

  focusSpellInput() {
    this.spellInputs.last.nativeElement.focus();
  }

  paste(event: ClipboardEvent) {
    event.preventDefault();
    event.clipboardData.getData('text').split(',').forEach(value => {
      this.addSpellChip(value);
    });
  }

}
