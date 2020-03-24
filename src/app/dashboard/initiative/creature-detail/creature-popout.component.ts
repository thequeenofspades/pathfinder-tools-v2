import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { Creature } from '../../monster';

@Component({
  selector: 'app-creature-popout',
  templateUrl: './creature-popout.component.html',
  styleUrls: ['./creature-popout.component.css']
})
export class CreaturePopoutComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CreaturePopoutComponent>,
    @Inject(MAT_DIALOG_DATA) public creature: Creature) { }

  ngOnInit() {
  }

  close(): void {
  	this.dialogRef.close();
  }

}
