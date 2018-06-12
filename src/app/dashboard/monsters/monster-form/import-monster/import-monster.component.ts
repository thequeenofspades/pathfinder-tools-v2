import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { startWith, map, take, debounceTime } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl, Validators, ValidationErrors, AbstractControl } from '@angular/forms';

import { EncounterService } from '../../../encounter.service';
import { MonsterI } from '../../../monster';

interface MonsterOp {
	name: string,
	cr: number
}

@Component({
  selector: 'app-import-monster',
  templateUrl: './import-monster.component.html',
  styleUrls: ['./import-monster.component.css']
})
export class ImportMonsterComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  	this.monsters$ = this.es.monsters$;
  	this.monsterControl = this.fb.control(this.form.get('basics.name').value, [], [this.monsterValidator.bind(this)]);
  	this.monsterControl.valueChanges.pipe(
  		debounceTime(1000)
  	).subscribe(val => {
  		this.filteredMonsters$ = this.filter(val);
  	});
  }

  @Input() public es: EncounterService;
  @Input() public form: FormGroup;
  @Input() public showQuantity: boolean;
  @Output() public cancel = new EventEmitter();
  @Output() public submit = new EventEmitter();

  monsterControl: FormControl;
  monsters$: Observable<MonsterOp[]>;
  filteredMonsters$: Observable<MonsterOp[]>;

  onCancel() {
  	this.cancel.emit();
  }

  onSubmit() {
  	this.submit.emit();
  }

  private filter(val: string): Observable<MonsterOp[]> {
  	return this.monsters$.map(monsters => {
  		return monsters.filter(m => {
  			return m.name.toLowerCase().includes(val.toLowerCase());
  		});
  	});
  }

  private monsterValidator(control: AbstractControl): Observable<ValidationErrors | null> {
  	return this.monsters$.map(monsters => {
  		return monsters.find(m => m.name == control.value) != undefined;
  	}).map(res => {
  		return res ? null : { 'dne': true };
  	});
  }

  protected importMonster(): void {
  	if (this.monsterControl.invalid) return;
  	let monster = this.monsterControl.value;
  	this.es.resetMonsterForm(this.form);
  	this.es.importMonster(monster).subscribe(m => {
  		this.es.setMonsterFormValue(m, this.form);
  	});
  }

}
