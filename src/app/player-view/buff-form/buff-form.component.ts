import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

// import { Creature } from '../../dashboard/monster';

interface Buff {
	name: string,
	duration: number,
	initiative: number,
	affected: Creature[],
	effect: string
};

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
  	@Inject(MAT_DIALOG_DATA) public data: {buff: Buff, order: Creature[], active: number, showNames: string}) { }

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
  		initiative: [this.data.order[this.data.active].initiative, Validators.required],
  		affected: [],
  		effect: ''
  	});
  	if (this.data.buff) {
  		this.form.patchValue(this.data.buff);
  	}
  	this.playerGroup = this.data.order.filter(cr => cr.hp == undefined);
  	this.monsterGroup = this.data.order.filter(cr => cr.hp != undefined && cr.visible);
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
