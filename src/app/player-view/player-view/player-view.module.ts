import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayerViewComponent } from '../player-view.component';
import { NoSessionComponent } from '../no-session/no-session.component';

import { MaterialModule } from '../../material-module/material-module.module';
import { PlayerViewRoutingModule } from '../player-view-routing/player-view-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    PlayerViewRoutingModule
  ],
  declarations: [
  	PlayerViewComponent,
  	NoSessionComponent
  ]
})
export class PlayerViewModule { }
