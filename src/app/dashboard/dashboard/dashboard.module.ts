import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NewSessionComponent } from '../new-session/new-session.component';
import { DashboardComponent } from '../dashboard.component';
import { PlayersComponent } from '../players/players.component';
import { MonstersComponent } from '../monsters/monsters.component';
import { InitiativeComponent } from '../initiative/initiative.component';
import { PlayerFormComponent } from '../players/player-form/player-form.component';
import { MonsterFormComponent } from '../monsters/monster-form/monster-form.component';
import { DamageFormComponent } from '../initiative/damage-form.component';
import { ConditionFormComponent } from '../initiative/condition-form.component';
import { InitiativeFormComponent } from '../players/initiative-form.component';
import { NoteFormComponent } from '../initiative/note-form.component';
import { EncounterFormComponent } from '../encounter-form/encounter-form.component';

import { DiceRollerComponent } from '../../dice-roller/dice-roller.component';

import { MaterialModule } from '../../material-module/material-module.module';
import { DashboardRoutingModule } from '../dashboard-routing/dashboard-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    NewSessionComponent,
  	DashboardComponent,
  	PlayersComponent,
  	MonstersComponent,
  	InitiativeComponent,
  	PlayerFormComponent,
  	MonsterFormComponent,
  	DamageFormComponent,
  	ConditionFormComponent,
  	InitiativeFormComponent,
  	NoteFormComponent,
  	EncounterFormComponent,
  	DiceRollerComponent
  ],
  entryComponents: [
    InitiativeFormComponent,
    NoteFormComponent,
    ConditionFormComponent,
    DamageFormComponent
  ]
})
export class DashboardModule { }
