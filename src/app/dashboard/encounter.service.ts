import { Injectable } from '@angular/core';
import { Subject, Observable, from } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { Encounter } from './encounter';
import { Monster, MonsterI, Creature } from './monster';
import { MessageService } from '../message.service';
import { InitiativeService } from './initiative.service';

@Injectable({
  providedIn: 'root'
})
export class EncounterService {

  constructor(private messageService: MessageService,
  	private initiativeService: InitiativeService,
    private db: AngularFirestore,
    private fb: FormBuilder) {
  }

  encountersCollection: AngularFirestoreCollection<any>;

  encounters = new Subject();
  encounters$ = this.encounters.asObservable();

  monsters$: Observable<{name: string, cr: number}[]>;

  sessionId: string;

  setup(sessionId: string): void {
    this.sessionId = sessionId;
    this.encountersCollection = this.db.collection('sessions').doc(sessionId).collection('encounters');
    this.importMonsters();
    this.refresh();
  }

  refresh(): void {
    this.encountersCollection.valueChanges().subscribe(e => {
      this.encounters.next(e);
    });
  }

  newEncounter(name: string, monsters: MonsterI[] = []): void {
    let encounter = new Encounter(name, monsters);
    let id = this.db.createId();
    this.encountersCollection.doc(id).set({...encounter, id: id}).then(_ => {
      this.messageService.add(`Created new encounter ${encounter.name}`);
    });
  }

  rename(encounter: {id: string}, name: string): void {
    this.encountersCollection.doc(encounter.id).update({name: name}).then(_ => {
      this.messageService.add(`Renamed ${name}`);
    });
  }

  removeEncounter(encounter: {name: string, id: string}): void {
    this.encountersCollection.doc(encounter.id).delete().then(_ => {
      this.messageService.add(`Deleted encounter ${encounter.name}`);
    });
  }

  addToEncounter(monster: MonsterI, encounter: {id: string, name: string}): void {
    this.encountersCollection.doc(encounter.id).ref.get().then(doc => {
      let monsters = doc.data().monsters || [];
      monsters.push({...monster, id: this.db.createId()});
      this.encountersCollection.doc(encounter.id).update({monsters: monsters}).then(_ => {
        this.messageService.add(`Added ${monster.basics.name} to ${encounter.name}`);
      });
    });
  }

  addMultipleToEncounter(monsters: MonsterI[], encounter: {id: string, name: string}): void {
    this.encountersCollection.doc(encounter.id).ref.get().then(doc => {
      let ms = doc.data().monsters || [];
      for (let monster of monsters) {
        ms.push({...monster, id: this.db.createId()});
      }
      this.encountersCollection.doc(encounter.id).update({monsters: ms}).then(_ => {
        this.messageService.add(`Added ${monsters.length} ${monsters[0].basics.name}s to ${encounter.name}`);
      });
    });
  }

  removeFromEncounter(monster: MonsterI, encounter: {id: string, name: string}): void {
    this.encountersCollection.doc(encounter.id).ref.get().then(doc => {
      let monsters = doc.data().monsters || [];
      monsters = monsters.filter(m => m.id != monster.id);
      this.encountersCollection.doc(encounter.id).update({monsters: monsters}).then(_ => {
        this.messageService.add(`Removed ${monster.basics.name} from ${encounter.name}`);
      });
    });
  }

  update(encounter: {id: string}, monster: MonsterI, updated: MonsterI): void {
    this.encountersCollection.doc(encounter.id).ref.get().then(doc => {
      let monsters = doc.data().monsters || [];
      let monsterref = monsters.find(m => m.id == monster.id);
      Object.assign(monsterref, updated);
      this.encountersCollection.doc(encounter.id).update({monsters: monsters}).then(_ => {
        this.messageService.add(`Updated ${updated.basics.name}`);
      });
    });
  }

  addEncounterToInitiative(encounter: {id: string}): void {
    this.encountersCollection.doc(encounter.id).ref.get().then(doc => {
      let monsters = (doc.data().monsters as MonsterI[]) || [];
      let preparedMonsters = monsters.map(monster => this.prepareMonsterForInitiative(monster));
      this.initiativeService.addMultiple(preparedMonsters);
    });
  }

  createMonsters(monster: MonsterI): MonsterI[] {
    let monsters = [];
    for (var i = 0; i < monster.basics.quantity; i++) {
      let newMonster = JSON.parse(JSON.stringify(monster));
      newMonster.basics.idx = i + 1;
      monsters.push(newMonster);
    }
    return monsters;
  }

  prepareMonsterForInitiative(monster: MonsterI): Creature {
    let creature = {
      ...JSON.parse(JSON.stringify(monster)),
      name: monster.basics.name,
      initiativeBonus: monster.basics.initiativeBonus,
      hp: monster.defense.hp,
      perceptionBonus: monster.basics.perceptionBonus,
      conScore: monster.statistics.conScore,
      conditions: [],
      attributes: [],
      notes: [],
      notification: {},
      currentHp: monster.defense.hp,
      imageUrl: monster.extras.imageUrl
    };
    return creature;
  }

  public setMonsterFormValue(model: MonsterI, form: FormGroup): void {
    model.basics.classes.forEach(() => {
      (form.get('basics.classes') as FormArray).push(this.buildClassFormGroup());
    });
    model.offense.attacks.forEach(() => {
      (form.get('offense.attacks') as FormArray).push(this.buildAttackFormGroup());
    });
    model.spells.slaLevels.forEach(sl => {
      let slaLevel = this.buildSlaLevelFormGroup();
      sl.slas.forEach(() => {
        (slaLevel.get('slas') as FormArray).push(this.buildSlaFormGroup(slaLevel));
      });
      (form.get('spells.slaLevels') as FormArray).push(slaLevel);
    });
    model.spells.spellLevels.forEach(sl => {
      let spellLevel = this.buildSpellLevelFormGroup(form.get('spells') as FormGroup);
      sl.spells.forEach(() => {
        (spellLevel.get('spells') as FormArray).push(this.buildSpellFormGroup());
      });
      (form.get('spells.spellLevels') as FormArray).push(spellLevel);
    });
    model.extras.specials.forEach(() => {
      (form.get('extras.specials') as FormArray).push(this.buildSpecialFormGroup());
    });
    model.extras.tactics.forEach(() => {
      (form.get('extras.tactics') as FormArray).push(this.buildTacticFormGroup());
    });
    form.patchValue(model);
  }

  public resetMonsterForm(form: FormGroup): void {
    (form.get('basics') as FormGroup).setControl('classes', new FormArray([]));
    (form.get('offense') as FormGroup).setControl('attacks', new FormArray([]));
    (form.get('spells') as FormGroup).setControl('slaLevels', new FormArray([]));
    (form.get('spells') as FormGroup).setControl('spellLevels', new FormArray([]));
    (form.get('extras') as FormGroup).setControl('specials', new FormArray([]));
    (form.get('extras') as FormGroup).setControl('tactics', new FormArray([]));
    form.reset();
  }

  public buildMonsterForm(): FormGroup {
    return this.fb.group({
      id: '',
      basics: this.fb.group({
        name: ['', Validators.required],
        quantity: [1, Validators.required],
        idx: 1,
        gender: '',
        race: '',
        classes: this.fb.array([]),
        alignment: '',
        size: '',
        type: '',
        initiativeBonus: ['', Validators.required],
        senses: '',
        perceptionBonus: '',
        aura: ''
      }),
      statistics: this.fb.group({
        strScore: '',
        dexScore: '',
        conScore: ['', Validators.required],
        intScore: '',
        wisScore: '',
        chaScore: '',
        bab: '',
        cmb: '',
        cmd: '',
        feats: '',
        skills: '',
        languages: '',
        sq: ''
      }),
      defense: this.fb.group({
        ac: '',
        acff: '',
        actouch: '',
        acnotes: '',
        hp: ['', Validators.required],
        hpnotes: '',
        fort: '',
        ref: '',
        will: '',
        savenotes: '',
        defensiveAbilities: '',
        resistances: '',
        immunities: '',
        dr: '',
        sr: '',
        weaknesses: ''
      }),
      offense: this.fb.group({
        speed: '',
        attacks: this.fb.array([]),
        space: '',
        reach: ''
      }),
      spells: this.fb.group({
        slaLevels: this.fb.array([]),
        slaCL: '',
        slaConcentration: '',
        spontaneous: false,
        spellLevels: this.fb.array([]),
        cl: '',
        concentration: ''
      }),
      extras: this.fb.group({
        specials: this.fb.array([]),
        gear: '',
        description: '',
        cr: '',
        xp: '',
        tactics: this.fb.array([]),
        imageUrl: ''
      })
    });
  }

  public buildClassFormGroup(): FormGroup {
    return this.fb.group({
      class: ['', Validators.required],
      level: ''
    });
  }

  public buildAttackFormGroup(): FormGroup {
    return this.fb.group({
      attack: ['', Validators.required],
      type: ['melee', Validators.required]
    });
  }

  public buildSlaLevelFormGroup(): FormGroup {
    let newSLALevel = this.fb.group({
      limited: 'Limited',
      uses: [0, Validators.required],
      slas: this.fb.array([])
    });
    newSLALevel.get('limited').valueChanges.subscribe(limited => {
      if (limited == 'At will' || limited == 'Constant') {
        newSLALevel.get('uses').setValidators([]);
        newSLALevel.get('uses').disable();
      } else {
        newSLALevel.get('uses').setValidators([Validators.required]);
        newSLALevel.get('uses').enable();
      }
    });
    return newSLALevel;
  }

  public buildSlaFormGroup(slaLevel: FormGroup): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      uses: slaLevel.get('uses').value
    });
  }

  public buildSpellLevelFormGroup(spellsFG: FormGroup): FormGroup {
    let newSpellLevel = this.fb.group({
      level: [(spellsFG.get('spellLevels') as FormArray).length, Validators.required],
      uses: 0,
      spells: this.fb.array([])
    });
    if (!newSpellLevel.get('level') || !spellsFG.get('spontaneous').value) {
      newSpellLevel.get('uses').disable();
    }
    spellsFG.get('spontaneous').valueChanges.subscribe(data => this.updateSpellUses(spellsFG, newSpellLevel));
    newSpellLevel.get('level').valueChanges.subscribe(data => this.updateSpellUses(spellsFG, newSpellLevel));
    return newSpellLevel;
  }

  public buildSpellFormGroup(): FormGroup {
    let newSpell = this.fb.group({
      name: ['', Validators.required],
      cast: false
    });
    return newSpell;
  }

  private updateSpellUses(spellsFG: FormGroup, spellLevel: FormGroup) {
    if (spellsFG.get('spontaneous').value && spellLevel.get('level').value != 0) {
      spellLevel.get('uses').setValidators([Validators.required]);
      spellLevel.get('uses').enable();
    } else {
      spellLevel.get('uses').setValidators([]);
      spellLevel.get('uses').disable();
    }
  }

  public buildSpecialFormGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      type: '',
      description: ''
    });
  }

  public buildTacticFormGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      tactic: ''
    });
  }

  public importMonsters(): void {
    this.monsters$ = from(this.db.collection('monsters_converted').doc('index').ref.get()).pipe(
      take(1),
      map(doc => doc.data()['index'] as {name: string, cr: number}[]));
  }

  public importMonster(id: string): Observable<MonsterI> {
    return from(this.db.collection('monsters_converted').doc(id).ref.get()).pipe(
      take(1),
      map(doc => doc.data() as MonsterI)
    );
  }

}
