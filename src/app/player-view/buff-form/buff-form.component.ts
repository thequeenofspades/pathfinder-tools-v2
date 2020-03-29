import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Condition } from '../../dashboard/condition';

// import { Creature } from '../../dashboard/monster';

interface Creature {
	initiative: number,
	name: string,
	hp: number,
	visible: boolean
}

@Component({
  selector: 'app-buff-form',
  templateUrl: './buff-form.component.html',
  styleUrls: ['./buff-form.component.css']
})
export class BuffFormComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<BuffFormComponent>,
  	private fb: FormBuilder,
  	@Inject(MAT_DIALOG_DATA) public data: {buff: Condition, order: Creature[], active: number, showNames: string}) { }

  ngOnInit() {
  	this.createForm();
  }

  form: FormGroup;

  playerGroup: Creature[];
  monsterGroup: Creature[];

  createForm() {
  	this.form = this.fb.group({
  		name: ['', Validators.required],
      duration: ['', Validators.required],
      permanent: [false],
  		initiative: [this.data.order[this.data.active].initiative, Validators.required],
  		affected: [[], Validators.required],
  		description: ''
    });

    this.form.get('permanent').valueChanges.subscribe(data => this.onPermanentValueChanged(data));

  	if (this.data.buff) {
  		this.form.patchValue(this.data.buff);
  	}
  	this.playerGroup = this.data.order.filter(cr => cr.hp == undefined);
  	this.monsterGroup = this.data.order.filter(cr => cr.hp != undefined && cr.visible);
  }

  onPermanentValueChanged(selected: boolean): void {
    if (selected) {
      this.form.get('duration').clearValidators();
      this.form.get('duration').disable();
      this.form.get('initiative').clearValidators();
      this.form.get('initiative').disable();
    } else {
      this.form.get('duration').setValidators([Validators.required]);
      this.form.get('duration').enable();
      this.form.get('initiative').setValidators([Validators.required]);
      this.form.get('initiative').enable();
    }
    this.form.get('duration').updateValueAndValidity();
    this.form.get('initiative').updateValueAndValidity();
  }

  compareFn(c1, c2) {
  	return c1 && c2 ? c1.id == c2.id : c1 == c2;
  }

  trySubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
