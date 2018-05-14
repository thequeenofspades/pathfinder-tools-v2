import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { Encounter } from './encounter';
import { Monster } from './monster';
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

  newEncounter(name: string, monsters: Monster[] = []): void {
    let encounter = new Encounter(name, monsters);
    let id = this.db.createId();
    this.encountersCollection.doc(id).set({...encounter, id: id}).then(_ => {
      this.messageService.add(`Created new encounter ${encounter.name}`);
    });
  }

  removeEncounter(encounter: {name: string, id: string}): void {
    this.encountersCollection.doc(encounter.id).delete().then(_ => {
      this.messageService.add(`Deleted encounter ${encounter.name}`);
    });
  }

  addToEncounter(monster: Monster, encounter: {id: string, name: string}): void {
    this.encountersCollection.doc(encounter.id).ref.get().then(doc => {
      let monsters = doc.data().monsters || [];
      monsters.push({...monster, id: this.db.createId()});
      this.encountersCollection.doc(encounter.id).update({monsters: monsters}).then(_ => {
        this.messageService.add(`Added ${monster.name} to ${encounter.name}`);
      });
    });
  }

  addMultipleToEncounter(monsters: Monster[], encounter: {id: string, name: string}): void {
    this.encountersCollection.doc(encounter.id).ref.get().then(doc => {
      let ms = doc.data().monsters || [];
      for (let monster of monsters) {
        ms.push({...monster, id: this.db.createId()});
      }
      this.encountersCollection.doc(encounter.id).update({monsters: ms}).then(_ => {
        this.messageService.add(`Added ${monsters.length} ${monsters[0].name}s to ${encounter.name}`);
      });
    });
  }

  removeFromEncounter(monster: {id: string, name: string}, encounter: {id: string, name: string}): void {
    this.encountersCollection.doc(encounter.id).ref.get().then(doc => {
      let monsters = doc.data().monsters || [];
      monsters = monsters.filter(m => m.id != monster.id);
      this.encountersCollection.doc(encounter.id).update({monsters: monsters}).then(_ => {
        this.messageService.add(`Removed ${monster.name} from ${encounter.name}`);
      });
    });
  }

  update(encounter: {id: string}, monster: {id: string}, updated: Monster): void {
    this.encountersCollection.doc(encounter.id).ref.get().then(doc => {
      let monsters = doc.data().monsters || [];
      let monsterref = monsters.find(m => m.id == monster.id);
      Object.assign(monsterref, updated);
      this.encountersCollection.doc(encounter.id).update({monsters: monsters}).then(_ => {
        this.messageService.add(`Updated ${updated.name}`);
      });
    });
  }

  addEncounterToInitiative(encounter: {id: string}): void {
    this.encountersCollection.doc(encounter.id).ref.get().then(doc => {
      let monsters = doc.data().monsters || [];
      this.initiativeService.addMultiple(monsters);
    });
  }

  rename(encounter: {id: string}, name: string): void {
    this.encountersCollection.doc(encounter.id).update({name: name}).then(_ => {
      this.messageService.add(`Renamed ${name}`);
    });
  }

  createMonsters(monster: Monster): Monster[] {
    let monsters = [];
    for (var i = 0; i < monster.quantity; i++) {
      let newMonster = this.deepCopyMonster(monster);
      newMonster.idx = i + 1;
      monsters.push(newMonster);
    }
    return monsters;
  }

  deepCopyMonster(monster: Monster): Monster {
    let newMonster = new Monster(monster.name, monster.hp);
    Object.assign(newMonster, monster);
    newMonster.conditions = [];
    newMonster.attributes = [];
    newMonster.notes = [];
    newMonster.notification = {};
    return newMonster;
  }

}
