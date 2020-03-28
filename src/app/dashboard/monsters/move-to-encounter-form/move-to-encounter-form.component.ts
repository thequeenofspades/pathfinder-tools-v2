import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { Encounter } from '../../encounter';

@Component({
  selector: 'app-move-to-encounter-form',
  templateUrl: './move-to-encounter-form.component.html',
  styleUrls: ['./move-to-encounter-form.component.css']
})
export class MoveToEncounterFormComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MoveToEncounterFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  encounter: FormControl;

  ngOnInit(): void {
    this.encounter = new FormControl('', Validators.required);
  }

  sortedEncounters(encounters: Encounter[]): Encounter[] {
    return encounters.sort((a, b) => {
      return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
    });
  }

  trySubmit(): void {
    if (this.encounter.valid) {
      this.dialogRef.close(this.encounter.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
