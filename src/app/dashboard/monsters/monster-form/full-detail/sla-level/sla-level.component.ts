import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import {MatChipInputEvent} from '@angular/material';

@Component({
  selector: 'app-monster-form-sla-level',
  templateUrl: './sla-level.component.html',
  styleUrls: ['./sla-level.component.css']
})
export class SlaLevelComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

  @Input() form: FormGroup;
  @Output() remove = new EventEmitter();

  public slaTypes = ['Limited', 'At will', 'Constant'];

  get slas(): FormArray {
  	return this.form.get('slas') as FormArray;
  }

  addSla() {
    let newSla = this.fb.group({
      name: ['', Validators.required]
    });
    this.slas.push(newSla);
  }

  addSlaChip(event: MatChipInputEvent) {
  	if (event.value.trim().length) {
	  this.slas.push(this.fb.group({name: event.value.trim()}));
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
