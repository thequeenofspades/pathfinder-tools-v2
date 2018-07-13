import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PlayerViewComponent } from '../player-view.component';
import { NoSessionComponent } from '../no-session/no-session.component';

import { MaterialModule } from '../../material-module/material-module.module';
import { PlayerViewRoutingModule } from '../player-view-routing/player-view-routing.module';
import { BuffFormComponent } from '../buff-form/buff-form.component';
import { BuffViewComponent } from '../buff-view/buff-view.component';

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
  	BuffFormComponent,
  	BuffViewComponent
  ],
  entryComponents: [
    BuffFormComponent
  ]
})
export class PlayerViewModule { }
