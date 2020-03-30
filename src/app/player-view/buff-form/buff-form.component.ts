import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Condition, CONDITIONS } from '../../dashboard/condition';
import { PlayerOptions, InitiativeService, Initiative, VisibleOption } from '../../dashboard/initiative.service';
import { Observable, Subscription } from 'rxjs';
import { Creature, MonsterI, Monster } from '../../dashboard/monster';
import { startWith, map } from 'rxjs/operators';

interface MockCondition {
  name: string;
  description: string
}

@Component({
  selector: 'app-buff-form',
  templateUrl: './buff-form.component.html',
  styleUrls: ['./buff-form.component.css']
})
export class BuffFormComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<BuffFormComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {buff: Condition, creature: Creature, initService: InitiativeService, playerView: boolean}) { }
    
  private active: number = 0;
  conditions: MockCondition[];
  filteredConditions: Observable<MockCondition[]>;
  form: FormGroup;
  private init$: Subscription;
  monsterGroup: Creature[] = [];
  private order: Creature[] = [];
  playerGroup: Creature[] = [];
  private playerOptions: PlayerOptions;

  ngOnInit() {
    this.createForm();
    this.conditions = CONDITIONS;
    this.filteredConditions = this.form.get('name').valueChanges
      .pipe(startWith(''), map(val => this.filter(val)));
    this.init$ = this.data.initService.getInit().subscribe((init: Initiative) => {
      this.active = init.active;
      this.order = init.order;
      this.playerOptions = init.playerOptions;

      this.playerGroup = this.order.filter(cr => cr.hp == undefined);
      this.monsterGroup = this.order.filter(cr => cr.hp != undefined && this.shouldShowMonster(cr));
    
      this.form.get('initiative').setValue(this.order[this.active].initiative);
    });
  }

  ngOnDestroy() {
    this.init$.unsubscribe();
  }

  createForm() {
  	this.form = this.fb.group({
  		name: ['', Validators.required],
      duration: [undefined, Validators.required],
      permanent: [false],
  		initiative: [undefined, Validators.required],
  		affected: [this.data.creature ? [this.data.creature] : [], Validators.required],
  		description: ''
    });

    this.form.get('name').valueChanges.subscribe(data => this.onNameValueChanged(data));
    this.form.get('permanent').valueChanges.subscribe(data => this.onPermanentValueChanged(data));

  	if (this.data.buff) {
      // If a buff input was provided, we are editing a buff.
  		this.form.patchValue(this.data.buff);
  	}
  }

  displayName(condition?: MockCondition): string | undefined {
    return condition ? condition.name : undefined;
  }

  filter(val: string): MockCondition[] {
    return this.conditions.filter(c =>
      c.name.toLowerCase().includes(val.toLowerCase()));
  }

  onNameValueChanged(name: string): void {
    let condition = this.conditions.find(c => c.name == name);
    if (condition) {
      this.form.get('description').setValue(condition.description);
    }
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

  getDisplayName(monster: MonsterI): string {
    if (this.data.playerView) {
      if (this.playerOptions.nameOption == VisibleOption.NoShow) {
        return `Monster (init ${(monster as any).initiative})`;
      }
      let displayName = monster.basics.name;
      if (this.playerOptions.nameOption == VisibleOption.ShowNameAndNumber && monster.basics.quantity > 1) {
        displayName = `${displayName} (${monster.basics.idx})`;
      }
      return displayName;
    } else {
      let displayName = monster.basics.name;
      if (monster.basics.quantity > 1) {
        displayName = `${displayName} (${monster.basics.idx} of ${monster.basics.quantity})`;
      }
      return displayName;
    }
  }

  shouldShowMonster(monster: Creature): boolean {
    return !this.data.playerView || monster.visible;
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
