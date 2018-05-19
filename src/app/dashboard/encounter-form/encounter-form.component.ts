import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { EncounterService } from '../encounter.service';

@Component({
  selector: 'app-encounter-form',
  templateUrl: './encounter-form.component.html',
  styleUrls: ['./encounter-form.component.css']
})
export class EncounterFormComponent implements OnInit {

  constructor(private fb: FormBuilder,
  	private encounterService: EncounterService) { }

  ngOnInit() {
  	this.createForm();
  }

  @Input() name: string;
  @Output() onSubmitted = new EventEmitter<string>();
  @Output() onCanceled = new EventEmitter();

  encounterForm: FormGroup;

  createForm(): void {
  	this.encounterForm = this.fb.group({
  		'name': [this.name || '', Validators.required]
  	});
  }

  submit(): void {
  	let form = this.encounterForm;
  	if (form.valid) {
  		this.onSubmitted.emit(form.get('name').value);
      form.reset();
  	}
  }

  cancel(): void {
  	this.encounterForm.reset();
  	this.onCanceled.emit();
  }

}
