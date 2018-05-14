import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-damage-form',
  templateUrl: './damage-form.component.html',
  styles: []
})
export class DamageFormComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DamageFormComponent>) { }

  ngOnInit() {
    this.damage = new FormControl('', Validators.required);
  }

  damage: FormControl;

  trySubmit(): void {
    if (this.damage.valid) {
      this.dialogRef.close(this.damage.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
