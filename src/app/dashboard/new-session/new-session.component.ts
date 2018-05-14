import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, AsyncValidatorFn, AbstractControl } from '@angular/forms';

import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-new-session',
  templateUrl: './new-session.component.html',
  styleUrls: ['./new-session.component.css']
})
export class NewSessionComponent implements OnInit {

  constructor(private ds: DashboardService) { }

  ngOnInit() {
  	this.codeDM = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4)], this.codeValidator.bind(this));
    this.codePlayer = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4)], this.codeValidator.bind(this));
  }

  codeDM: FormControl;
  codePlayer: FormControl;

  start(): void {
  	this.ds.newSession();
  }

  restart(): void {
  	if (this.codeDM.valid) this.ds.goToSessionDM(this.codeDM.value);
  }

  go(): void {
    if (this.codePlayer.valid) this.ds.goToSessionPlayer(this.codePlayer.value);
  }

  codeValidator(control: AbstractControl) {
  	return this.ds.checkSession(control.value).map(res => {
  		return res ? null : {dne: control.value};
  	});
  }

}