import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { MessageService } from '../message.service';
import { InitiativeService } from './initiative.service';

import { Player } from './player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private messageService: MessageService,
    private db: AngularFirestore,
    private initiativeService: InitiativeService) {
  }

  playersCollection: AngularFirestoreCollection<Object>;

  players = new Subject<Player[]>();

  players$ = this.players.asObservable();

  setup(sessionId: string): void {
    this.playersCollection = this.db.collection('sessions').doc(sessionId).collection('players');
    this.refresh();
  }

  refresh(): void {
    this.playersCollection.valueChanges().subscribe(
      p => {
        this.players.next(this.convertPlayers(p));
      });
  }

  convertPlayers(players: any[]): Player[] {
    return players.map(player => this.convertPlayer(player));
  }

  convertPlayer(player: any): Player {
    let newPlayer = new Player(player.name);
    Object.assign(newPlayer, player);
    return newPlayer;
  }

  deepCopyPlayer(player: Player): Player {
    let playerCopy = new Player(player.name);
    Object.assign(playerCopy, player);
    playerCopy.conditions = [];
    playerCopy.notes = [];
    playerCopy.attributes = [];
    playerCopy.notification = {};
    return playerCopy;
  }

  add(player: Player): void {
  	this.messageService.add(`Added new player ${player.name}!`);
    player.id = this.db.createId();
    this.playersCollection.doc(player.id).set({...player});
  }

  delete(player: Player): void {
  	this.messageService.add(`Deleted ${player.name} from players`);
    this.playersCollection.doc(player.id).delete();
  }

  update(player: Player, updated: Player): void {
  	this.messageService.add(`Updated player ${player.name}`);
    this.playersCollection.doc(player.id).set({...updated});
  }

  clear(): void {
    this.messageService.add('Cleared all players');
    this.playersCollection.ref.get()
      .then(result => result.forEach(doc => doc.ref.delete()));
  }

  addToInitiative(player: Player, initiative: number = null): void {
    let playerCopy = this.deepCopyPlayer(player);
    if (initiative !== null) {
      this.initiativeService.add(playerCopy, initiative);
    } else {
      let roll = getRandomInt(1, 20);
      this.initiativeService.add(playerCopy, roll + player.initiativeBonus);
    }
  }

  addAllToInitiative(): void {
    this.playersCollection.ref.get()
      .then(q => {
        let players = q.docs.map(doc => {
          return this.convertPlayer(doc.data());
        });
        this.initiativeService.addMultiple(players);
      });
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}