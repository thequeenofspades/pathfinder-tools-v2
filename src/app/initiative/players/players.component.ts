import { Component, OnInit } from '@angular/core';

import { Player } from '../../player';
import { PlayerService } from '../../player.service';
import { InitiativeService } from '../../initiative.service'; 

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {

  constructor(private playerService: PlayerService,
  	private initiativeService: InitiativeService) { }

  ngOnInit() {
  	this.getPlayers();
  }

  showNewPlayerForm: boolean = false;

  currentPlayer: Player = new Player('Akita');

  players: Player[];

  private getPlayers() : void {
  	this.playerService.getPlayers()
  		.subscribe(players => this.players = players);
  }

  add(player: Player): void {
  	this.playerService.addPlayer(player)
  		.subscribe(players => this.players = players);
  }

  remove(player: Player) : void {
  	this.playerService.deletePlayer(player)
  		.subscribe(players => this.players = players);
  }

  update(player: Player, updated: Player) : void {
  	this.playerService.updatePlayer(player, updated)
  		.subscribe(players => this.players = players);
  }

  clear(): void {
  	this.playerService.clear()
  		.subscribe(players => this.players = players);
  }

  addToInitiative(player: Player, initiative: number = null): void {
  	if (initiative) {
  		this.initiativeService.add(player, initiative);
  	} else {
	  	let roll = getRandomInt(1, 20);
	  	this.initiativeService.add(player, roll + player.initiativeBonus);
	}
  }

  addAllToInitiative(): void {
  	for (let player of this.players) {
  		this.addToInitiative(player);
  	}
  }

  rollPerception(player: Player): void {
  	let roll = getRandomInt(1, 20);
  	player.notification = `Perception: ${roll+player.perceptionBonus}`;
  }

  rollSenseMotive(player: Player): void {
  	let roll = getRandomInt(1, 20);
  	player.notification = `Sense Motive: ${roll+player.senseMotiveBonus}`;
  }

  rollPerceptionForAll(): void {
  	for (let player of this.players) {
  		this.rollPerception(player);
  	}
  }

  rollSenseMotiveForAll(): void {
  	for (let player of this.players) {
  		this.rollSenseMotive(player);
  	}
  }

}

// Returns a random integer between min (included) and max (included)

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
