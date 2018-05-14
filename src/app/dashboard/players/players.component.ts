import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
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
  	player.notification.perception = `${roll+player.perceptionBonus}`;
  }

  rollSenseMotive(player: Player): void {
  	let roll = getRandomInt(1, 20);
  	player.notification.senseMotive = `${roll+player.senseMotiveBonus}`;
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

}

// Returns a random integer between min (included) and max (included)

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
