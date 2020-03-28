import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-initiative-form',
  templateUrl: './initiative-form.component.html',
  styles: []
})
export class InitiativeFormComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<InitiativeFormComponent>) { }

  ngOnInit() {
    this.roll = new FormControl(0, Validators.required);
  }

  roll: FormControl;

  onCancel(): void {
    this.dialogRef.close();
  }

}
