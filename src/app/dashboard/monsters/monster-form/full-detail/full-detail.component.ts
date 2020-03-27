import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { EncounterService } from '../../../encounter.service';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';

@Component({
  selector: 'app-monster-form-full-detail',
  templateUrl: './full-detail.component.html',
  styleUrls: ['./full-detail.component.css']
})
export class FullDetailComponent implements OnInit {

  constructor(private fb: FormBuilder, private es: EncounterService, private storage: AngularFireStorage) { }

  ngOnInit() {
  }

  @Input() public form: FormGroup;
  @Input() public showQuantity: boolean;
  @Output() public cancel = new EventEmitter();
  @Output() public submit = new EventEmitter();

  public attackTypes = ['melee', 'ranged', 'special'];
  public specialTypes = ['Ex', 'Su', 'Sp'];
  public uploadingMsg: string;

  onCancel() {
  	this.cancel.emit();
  }

  onSubmit() {
  	this.submit.emit();
  }

  abilityBonus(score: number): number {
    return Math.floor((score - 10) / 2);
  }

  get classes(): FormArray {
  	return this.form.get('basics.classes') as FormArray;
  }

  get attacks(): FormArray {
  	return this.form.get('offense.attacks') as FormArray;
  }

  get slaLevels(): FormArray {
    return this.form.get('spells.slaLevels') as FormArray;
  }

  get spellLevels(): FormArray {
    return this.form.get('spells.spellLevels') as FormArray;
  }

  get specials(): FormArray {
  	return this.form.get('extras.specials') as FormArray;
  }

  get tactics(): FormArray {
    return this.form.get('extras.tactics') as FormArray;
  }

  addClass() {
  	this.classes.push(this.es.buildClassFormGroup());
  }

  removeClass(i: number) {
  	this.classes.removeAt(i);
  }

  addAttack() {
  	this.attacks.push(this.es.buildAttackFormGroup());
  }

  removeAttack(i: number) {
  	this.attacks.removeAt(i);
  }

  addSLALevel() {
    this.slaLevels.push(this.es.buildSlaLevelFormGroup());
  }

  removeSLALevel(i: number) {
  	this.slaLevels.removeAt(i);
  }

  addSpellLevel() {
    this.spellLevels.push(this.es.buildSpellLevelFormGroup(this.form.get('spells') as FormGroup));
  }

  removeSpellLevel(i: number) {
  	this.spellLevels.removeAt(i);
  }

  addSpecial() {
  	this.specials.push(this.es.buildSpecialFormGroup());
  }

  removeSpecial(i: number) {
  	this.specials.removeAt(i);
  }

  addTactic() {
    this.tactics.push(this.es.buildTacticFormGroup());
  }

  removeTactic(i: number) {
    this.tactics.removeAt(i);
  }

  uploadImage(event) {
    this.uploadingMsg = 'Uploading...';
    let fileList: FileList = event.target.files;
    if (fileList.length == 0) {
      return;
    }
    let file: File = fileList[0];
    let storageRef: AngularFireStorageReference = this.storage.ref('images').child(this.es.sessionId).child(file.name);
    storageRef.put(file).then(snapshot => {
      this.uploadingMsg = 'Done!';
      snapshot.ref.getDownloadURL().then(url => {
        this.form.get('extras.imageUrl').setValue(url);
      });
    }, error => {
      this.uploadingMsg = 'Error: ' + error.message;
    });
  }

}
