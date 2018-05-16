import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { InitiativeService } from '../../initiative.service';

@Component({
  selector: 'app-player-view-options',
  templateUrl: './player-view-options.component.html',
  styleUrls: ['./player-view-options.component.css']
})
export class PlayerViewOptionsComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  	this.optionsForm = this.fb.group({
  		healthOption: '',
  		conditionOption: ''
  	});
  	this.initService.getPlayerOptions().subscribe(opts => {
  		this.optionsForm.setValue(opts);
  		this.optionsForm.valueChanges.subscribe(_ => this.updateOptions());
  	});
  }

  @Input() code: string;
  @Input() initService: InitiativeService;

  optionsForm: FormGroup;

  healthOptions: string[] = ['Health bar', 'Detailed', 'Vague', 'None'];
  conditionOptions: string[] = ['Condition and duration', 'Condition only', 'None'];

  updateOptions(): void {
  	this.initService.updatePlayerOptions(this.optionsForm.value);
  }

}
