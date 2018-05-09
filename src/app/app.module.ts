import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from './material-module/material-module.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InitiativeComponent } from './initiative/initiative.component';
import { PlayersComponent } from './initiative/players/players.component';
import { MonstersComponent } from './initiative/monsters/monsters.component';
import { InitiativeOrderComponent } from './initiative/initiative-order/initiative-order.component';
import { PlayerFormComponent } from './initiative/players/player-form/player-form.component';
import { MessagesComponent } from './messages/messages.component';
import { MonsterFormComponent } from './initiative/monsters/monster-form/monster-form.component';
import { DamageFormComponent } from './initiative/initiative-order/damage-form.component';
import { ConditionFormComponent } from './initiative/initiative-order/condition-form.component';
import { InitiativeFormComponent } from './initiative/players/initiative-form.component';
import { NoteFormComponent } from './initiative/initiative-order/note-form.component';
import { EncounterFormComponent } from './initiative/encounter-form/encounter-form.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    InitiativeComponent,
    PlayersComponent,
    MonstersComponent,
    InitiativeOrderComponent,
    PlayerFormComponent,
    MessagesComponent,
    MonsterFormComponent,
    DamageFormComponent,
    ConditionFormComponent,
    InitiativeFormComponent,
    NoteFormComponent,
    EncounterFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  entryComponents: [
    InitiativeFormComponent,
    NoteFormComponent,
    ConditionFormComponent,
    DamageFormComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
