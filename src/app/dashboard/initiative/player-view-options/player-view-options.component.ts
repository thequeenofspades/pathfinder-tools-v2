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
  		nameOption: '',
  		healthOption: '',
      visibleOption: ''
    });
    // When the DB copy gets updated, update this form.
  	this.initService.getPlayerOptions().subscribe(opts => {
  		this.optionsForm.setValue(opts);
    });
    // When this form gets updated, update the DB copy.
    this.optionsForm.valueChanges.subscribe(_ => this.updateOptions());
  }

  @Input() code: string;
  @Input() initService: InitiativeService;

  optionsForm: FormGroup;

  nameOptions: string[] = ['Show names and numbers', 'Show names', "Don't show"];
  healthOptions: string[] = ['Health bar', 'Detailed', 'Vague', 'None'];
  visibleOptions: string[] = ['visible', 'invisible'];

  updateOptions(): void {
  	this.initService.updatePlayerOptions(this.optionsForm.value);
  }

}
