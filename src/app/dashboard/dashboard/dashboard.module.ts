import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MomentModule } from 'ngx-moment';

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
import { CreatureDetailComponent } from '../initiative/creature-detail/creature-detail.component';
import { CreaturePopoutComponent } from '../initiative/creature-detail/creature-popout.component';

import { StopClickDirective } from '../../stop-click.directive';
import { FullDetailComponent } from '../monsters/monster-form/full-detail/full-detail.component';
import { SpellLevelComponent } from '../monsters/monster-form/full-detail/spell-level/spell-level.component';
import { MonsterPreviewComponent } from '../monsters/monster-form/full-detail/monster-preview/monster-preview.component';
import { SlaLevelComponent } from '../monsters/monster-form/full-detail/sla-level/sla-level.component';

import { PlusPipe } from '../../plus.pipe';
import { RollableComponent } from '../rollable/rollable.component';
import { InteractiveSpellListComponent } from '../interactive-spell-list/interactive-spell-list.component';
import { InteractiveSlaListComponent } from '../interactive-sla-list/interactive-sla-list.component';
import { InteractiveConditionListComponent } from '../interactive-condition-list/interactive-condition-list.component';
import { InitiativeTableComponent } from '../initiative/initiative-table/initiative-table.component';
import { ImportMonsterComponent } from '../monsters/monster-form/import-monster/import-monster.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MomentModule
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
    ConditionDetailComponent,
    CreatureDetailComponent,
    StopClickDirective,
    FullDetailComponent,
    SpellLevelComponent,
    MonsterPreviewComponent,
    SlaLevelComponent,
    PlusPipe,
    RollableComponent,
    InteractiveSpellListComponent,
    InteractiveSlaListComponent,
    InteractiveConditionListComponent,
    InitiativeTableComponent,
    ImportMonsterComponent,
    CreaturePopoutComponent
  ],
  entryComponents: [
    InitiativeFormComponent,
    NoteFormComponent,
    ConditionFormComponent,
    DamageFormComponent,
    ConditionDetailComponent,
    CreaturePopoutComponent
  ]
})
export class DashboardModule { }
