import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Player } from '../../player';
import { PlayerService } from '../../player.service';
import { InitiativeService } from '../../initiative.service'; 
import { InitiativeFormComponent } from './initiative-form.component';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {

  constructor(private playerService: PlayerService,
  	private initiativeService: InitiativeService,
    public dialog: MatDialog) { }

  ngOnInit() {
  	this.getPlayers();
  }

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
  	if (initiative !== null) {
  		this.initiativeService.add(player, initiative);
  	} else {
	  	let roll = getRandomInt(1, 20);
	  	this.initiativeService.add(player, roll + player.initiativeBonus);
	  }
  }

  openInitiativeDialog(player: Player): void {
    let dialogRef = this.dialog.open(InitiativeFormComponent, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(roll => {
      if (roll !== undefined) {
        this.addToInitiative(player, roll);
      }
    })
  }

  addAllToInitiative(): void {
  	for (let player of this.players) {
  		this.addToInitiative(player);
  	}
  }

  rollPerception(player: Player): void {
  	let roll = getRandomInt(1, 20);
  	player.notification.perception = `${roll+player.perceptionBonus}`;
  }

  rollSenseMotive(player: Player): void {
  	let roll = getRandomInt(1, 20);
  	player.notification.senseMotive = `${roll+player.senseMotiveBonus}`;
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
