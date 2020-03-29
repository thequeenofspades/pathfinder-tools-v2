import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { EncounterService } from '../../../encounter.service';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { SlaLevelComponent } from './sla-level/sla-level.component';
import { SpellLevelComponent } from './spell-level/spell-level.component';
import { xpFromCr, crFromXp } from '../../../encounter';

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

  @ViewChildren("classInput") classInputs: QueryList<ElementRef>;
  @ViewChildren("attackInput") attackInputs: QueryList<ElementRef>;
  @ViewChildren(SlaLevelComponent) slaLevelComponents: QueryList<SlaLevelComponent>;
  @ViewChildren(SpellLevelComponent) spellLevelComponents: QueryList<SpellLevelComponent>;
  @ViewChildren("tacticInput") tacticInputs: QueryList<ElementRef>;
  @ViewChildren("specialInput") specialInputs: QueryList<ElementRef>;

  @ViewChild("slaCL") slaCLInput: ElementRef;
  @ViewChild("spellCL") spellCLInput: ElementRef;

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

  crFromXp(xp: number): number {
    return crFromXp(xp);
  }

  xpFromCr(cr: number): number {
    return xpFromCr(cr);
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
    setTimeout(_ => {
      this.classInputs.last.nativeElement.focus();
    });
  }

  removeClass(i: number) {
  	this.classes.removeAt(i);
  }

  addAttack() {
    this.attacks.push(this.es.buildAttackFormGroup());
    setTimeout(_ => {
      this.attackInputs.last.nativeElement.focus();
    });
  }

  removeAttack(i: number) {
  	this.attacks.removeAt(i);
  }

  addSLALevel() {
    this.slaLevels.push(this.es.buildSlaLevelFormGroup());
    setTimeout(_ => {
      if (this.slaLevels.length == 1) {
        this.slaCLInput.nativeElement.focus();
      } else {
        this.slaLevelComponents.last.focusSlaInput();
      }
    });
  }

  removeSLALevel(i: number) {
  	this.slaLevels.removeAt(i);
  }

  addSpellLevel() {
    this.spellLevels.push(this.es.buildSpellLevelFormGroup(this.form.get('spells') as FormGroup));
    setTimeout(_ => {
      if (this.spellLevels.length == 1) {
        this.spellCLInput.nativeElement.focus();
      } else {
        this.spellLevelComponents.last.focusSpellInput();
      }
    });
  }

  removeSpellLevel(i: number) {
  	this.spellLevels.removeAt(i);
  }

  addSpecial() {
    this.specials.push(this.es.buildSpecialFormGroup());
    setTimeout(_ => {
      this.specialInputs.last.nativeElement.focus();
    });
  }

  removeSpecial(i: number) {
  	this.specials.removeAt(i);
  }

  addTactic() {
    this.tactics.push(this.es.buildTacticFormGroup());
    setTimeout(_ => {
      this.tacticInputs.last.nativeElement.focus();
    });
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
    let storageRef: AngularFireStorageReference = this.storage.ref('sessions').child(this.es.sessionId).child(file.name);
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
