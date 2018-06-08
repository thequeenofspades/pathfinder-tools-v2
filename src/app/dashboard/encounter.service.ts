import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

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
    private db: AngularFirestore) {
  }

  encountersCollection: AngularFirestoreCollection<any>;

  encounters = new Subject();
  encounters$ = this.encounters.asObservable();

  setup(sessionId: string): void {
    this.encountersCollection = this.db.collection('sessions').doc(sessionId).collection('encounters');
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
      monsters = monsters.filter(m => m.id != (monster as any).id);  // find a way to fix this
      this.encountersCollection.doc(encounter.id).update({monsters: monsters}).then(_ => {
        this.messageService.add(`Removed ${monster.basics.name} from ${encounter.name}`);
      });
    });
  }

  update(encounter: {id: string}, monster: MonsterI, updated: MonsterI): void {
    this.encountersCollection.doc(encounter.id).ref.get().then(doc => {
      let monsters = doc.data().monsters || [];
      let monsterref = monsters.find(m => m.id == (monster as any).id);  // find a way to fix this
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
      currentHp: monster.defense.hp
    };
    return creature;
  }

}
