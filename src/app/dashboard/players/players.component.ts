import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { Player } from '../player';
import { PlayerService } from '../player.service';
import { InitiativeService } from '../initiative.service'; 
import { InitiativeFormComponent } from './initiative-form.component';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
  providers: [PlayerService, InitiativeService]
})
export class PlayersComponent implements OnInit {

  constructor(public playerService: PlayerService,
  	public initiativeService: InitiativeService,
    public dialog: MatDialog,
    private route: ActivatedRoute) { }

  notifications: any = {};

  ngOnInit() { 
    this.route.data.subscribe((data: {id: string}) => {
      this.playerService.setup(data.id);
      this.initiativeService.setup(data.id);
    });
  }

  openInitiativeDialog(player: Player): void {
    let dialogRef = this.dialog.open(InitiativeFormComponent, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(roll => {
      if (roll !== undefined) {
        this.playerService.addToInitiative(player, roll);
      }
    })
  }

  rollPerception(player: Player): void {
    let roll = getRandomInt(1, 20);
    this.notifications[player.id] = {};
    this.notifications[player.id].perception = `${roll+player.perceptionBonus}`;
  }

  rollSenseMotive(player: Player): void {
    let roll = getRandomInt(1, 20);
    this.notifications[player.id] = {};
  	this.notifications[player.id].senseMotive = `${roll+player.senseMotiveBonus}`;
  }

  rollPerceptionForAll(players: Player[]): void {
  	for (let player of players) {
  		this.rollPerception(player);
  	}
  }

  rollSenseMotiveForAll(players: Player[]): void {
  	for (let player of players) {
  		this.rollSenseMotive(player);
  	}
  }

  sortedPlayers(players: Player[]): Player[] {
    return players.sort((a, b) => {
      return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
    });
  }

}

// Returns a random integer between min (included) and max (included)

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
