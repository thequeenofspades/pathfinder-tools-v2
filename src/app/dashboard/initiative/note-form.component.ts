import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.component.html',
  styles: []
})
export class NoteFormComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<NoteFormComponent>) { }

  ngOnInit() {
    this.note = new FormControl('', Validators.required);
  }

  note: FormControl;

  trySubmit(): void {
    if (this.note.valid) {
      this.dialogRef.close(this.note.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
