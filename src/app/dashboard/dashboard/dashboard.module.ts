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
import { PlayerViewOptionsComponent } from '../initiative/player-view-options/player-view-options.component';

import { DiceRollerComponent } from '../../dice-roller/dice-roller.component';

import { MaterialModule } from '../../material-module/material-module.module';
import { DashboardRoutingModule } from '../dashboard-routing/dashboard-routing.module';
import { ConditionDetailComponent } from '../initiative/condition-detail/condition-detail.component';

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
  	DiceRollerComponent,
    PlayerViewOptionsComponent,
    ConditionDetailComponent
  ],
  entryComponents: [
    InitiativeFormComponent,
    NoteFormComponent,
    ConditionFormComponent,
    DamageFormComponent,
    ConditionDetailComponent
  ]
})
export class DashboardModule { }
