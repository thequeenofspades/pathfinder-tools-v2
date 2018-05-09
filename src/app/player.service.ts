import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { MessageService } from './message.service';

import { Player } from './player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private messageService: MessageService) { }

  players: Player[] = [
  	new Player('Aazot'),
  	new Player('Akita')];

  getPlayers(): Observable<Player[]> {
  	return of(this.players);
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

  addPlayer(player: Player): Observable<Player[]> {
  	this.messageService.add(`Added new player ${player.name}!`);
  	this.players.push(player);
  	return of(this.players);
  }

  deletePlayer(player: Player): Observable<Player[]> {
  	this.messageService.add(`Deleted ${player.name} from players`);
  	this.players = this.players.filter(p => p != player);
  	return of(this.players);
  }

  updatePlayer(player: Player, updated: Player): Observable<Player[]> {
  	this.messageService.add(`Updated player ${player.name}`);
  	let playerToUpdate = this.players.indexOf(player);
  	Object.assign(this.players[playerToUpdate], updated);
  	return of(this.players);
  }

  clear(): Observable<Player[]> {
    this.messageService.add('Cleared all players');
    this.players = [];
    return of(this.players);
  }
}
