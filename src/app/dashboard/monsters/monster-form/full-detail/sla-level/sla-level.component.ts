import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import {MatChipInputEvent} from '@angular/material';
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

  public slaTypes = ['Limited', 'At will', 'Constant'];

  get slas(): FormArray {
  	return this.form.get('slas') as FormArray;
  }

  addSla() {
    this.slas.push(this.es.buildSlaFormGroup(this.form));
  }

  addSlaChip(event: MatChipInputEvent) {
  	if (event.value.trim().length) {
      let newSla = this.es.buildSlaFormGroup(this.form);
      newSla.patchValue({name: event.value.trim()});
      this.slas.push(newSla);
  	}
    	if (event.input) event.input.value = '';
    }

  removeSla(i: number) {
  	this.slas.removeAt(i);
  }

  removeSlaLevel() {
  	this.remove.emit();
  }

}