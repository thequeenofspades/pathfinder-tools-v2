import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { EncounterService } from '../../../../encounter.service';

@Component({
  selector: 'app-monster-form-sla-level',
  templateUrl: './sla-level.component.html',
  styleUrls: ['./sla-level.component.css']
})
export class SlaLevelComponent implements OnInit {

  constructor(private fb: FormBuilder, private es: EncounterService) { }

  ngOnInit() {
  }

  @Input() form: FormGroup;
  @Output() remove = new EventEmitter();

  @ViewChildren("slaInput") slaInputs: QueryList<ElementRef>;

  public slaTypes = ['Limited', 'At will', 'Constant'];

  get slas(): FormArray {
  	return this.form.get('slas') as FormArray;
  }

  addSla() {
    this.slas.push(this.es.buildSlaFormGroup(this.form));
  }

  tokenEnd(event: MatChipInputEvent) {
  	this.addSlaChip(event.value);
    if (event.input) event.input.value = '';
  }

  addSlaChip(value: string): void {
    if (value.trim().length) {
      let newSla = this.es.buildSlaFormGroup(this.form);
      newSla.patchValue({name: value.trim()});
      this.slas.push(newSla);
  	}
  }

  removeSla(i: number) {
  	this.slas.removeAt(i);
  }

  removeSlaLevel() {
  	this.remove.emit();
  }

  focusSlaInput() {
    this.slaInputs.last.nativeElement.focus();
  }

  paste(event: ClipboardEvent): void {
    event.preventDefault();
    event.clipboardData.getData('text').split(',').forEach(value => {
      this.addSlaChip(value);
    });
  }

}
