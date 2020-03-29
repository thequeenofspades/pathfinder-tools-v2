import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CONDITIONS } from '../condition';
import { Creature } from '../monster';

interface MockCondition {
  name: string;
  description: string
}

@Component({
  selector: 'app-condition-form',
  templateUrl: './condition-form.component.html',
  styles: []
})
export class ConditionFormComponent implements OnInit {

  conditionForm: FormGroup;

  conditions: MockCondition[];

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<ConditionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {creature: Creature, currentInitiative: number, order: Creature[]}) {  }

  ngOnInit() {
    this.createForm();
    this.conditions = CONDITIONS;
    this.filteredConditions = this.conditionForm.get('name').valueChanges
      .pipe(startWith(''), map(val => this.filter(val)));
  }

  customCondition: boolean = false;

  filteredConditions: Observable<MockCondition[]>;

  playerGroup: Creature[];
  monsterGroup: Creature[];

  filter(val: string): MockCondition[] {
    return this.conditions.filter(c =>
      c.name.toLowerCase().includes(val.toLowerCase()));
  }

  displayName(condition?: MockCondition): string | undefined {
    return condition ? condition.name : undefined;
  }

  createForm(): void {
    this.conditionForm = this.fb.group({
      name: ['', Validators.required],
      description: '',
      duration: [0, Validators.required],
      permanent: [false],
      initiative: [this.data.currentInitiative, Validators.required],
      affected: [[this.data.creature], Validators.required]
    });
    this.conditionForm.get('name').valueChanges.subscribe(data => this.onNameValueChanged(data));
    this.conditionForm.get('permanent').valueChanges.subscribe(data => this.onPermanentValueChanged(data));

    this.playerGroup = this.data.order.filter(cr => cr.hp == undefined);
  	this.monsterGroup = this.data.order.filter(cr => cr.hp != undefined);
  }

  onNameValueChanged(name: string): void {
    let condition = this.conditions.find(c => c.name == name);
    if (condition) {
      this.conditionForm.get('description').setValue(condition.description);
    }
  }

  onPermanentValueChanged(selected: boolean): void {
    if (selected) {
      this.conditionForm.get('duration').clearValidators();
      this.conditionForm.get('duration').disable();
    } else {
      this.conditionForm.get('duration').setValidators([Validators.required]);
      this.conditionForm.get('duration').enable();
    }
    this.conditionForm.get('duration').updateValueAndValidity();
  }

  compareFn(c1, c2) {
  	return c1 && c2 ? c1.id == c2.id : c1 == c2;
  }

  trySubmit(): void {
    if (this.conditionForm.valid) {
      this.dialogRef.close(this.conditionForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
