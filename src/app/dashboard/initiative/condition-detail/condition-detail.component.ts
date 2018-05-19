import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { Condition } from '../../condition';

@Component({
  selector: 'app-condition-detail',
  templateUrl: './condition-detail.component.html',
  styleUrls: ['./condition-detail.component.css']
})
export class ConditionDetailComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConditionDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public condition: Condition) { }

  ngOnInit() {
  }

  close(): void {
  	this.dialogRef.close();
  }

}
