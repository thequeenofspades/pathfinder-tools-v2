import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { LocalStorage } from '@ngx-pwa/local-storage';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-new-session',
  templateUrl: './new-session.component.html',
  styleUrls: ['./new-session.component.css']
})
export class NewSessionComponent implements OnInit {

  constructor(private ds: DashboardService,
    protected localStorage: LocalStorage) { }

  ngOnInit() {
  	this.codeDM = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4)], this.codeValidator.bind(this));
    this.codePlayer = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4)], this.codeValidator.bind(this));
    this.getOldCodes();
  }

  codeDM: FormControl;
  codePlayer: FormControl;
  savedCodes: string[];
  savedSessions: Object;

  getOldCodes(): void {
    moment.updateLocale('en', {
      relativeTime: {
        future: "in %s",
        past: "%s",
        s: "just now",
        ss: '%ds ago',
        m: "1m ago",
        mm: "%dm ago",
        h: "1h ago",
        hh: "%dh ago",
        d: "1d ago",
        dd: "%dd ago",
        M: "1mo ago",
        MM: "%dmo ago",
        y: "1yr ago",
        yy: "%dyr ago"
      }
    });
    this.localStorage.getItem<string[]>('sessionCodes').subscribe(codes => {
      let sessionCodes: string[] = codes as string[] || [];
      this.ds.filterValidSessions(Object.keys(sessionCodes)).subscribe(validCodes => {
        this.savedCodes = validCodes.sort(function(a, b) {
          return sessionCodes[b] - sessionCodes[a];
        });
        this.savedSessions = {};
        this.savedCodes.forEach(c => {
          this.savedSessions[c] = sessionCodes[c];
        });
        this.localStorage.setItemSubscribe('sessionCodes', this.savedSessions);
      });
    });
  }

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
  	return this.ds.checkSession(control.value).pipe(map(res => {
  		return res ? null : {dne: control.value};
  	}));
  }

}