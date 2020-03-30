import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PlayerViewComponent } from '../player-view.component';
import { NoSessionComponent } from '../no-session/no-session.component';

import { MaterialModule } from '../../material-module/material-module.module';
import { PlayerViewRoutingModule } from '../player-view-routing/player-view-routing.module';
import { ConditionFormComponent } from '../condition-form/condition-form.component';
import { ConditionViewComponent } from '../condition-view/condition-view.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    PlayerViewRoutingModule
  ],
  declarations: [
  	PlayerViewComponent,
  	NoSessionComponent,
  	ConditionFormComponent,
  	ConditionViewComponent
  ],
  entryComponents: [
    ConditionFormComponent
  ]
})
export class PlayerViewModule { }
