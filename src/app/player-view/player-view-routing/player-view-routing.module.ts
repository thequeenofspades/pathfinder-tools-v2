import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlayerViewComponent } from '../player-view.component';
import { NoSessionComponent } from '../no-session/no-session.component';

import { PlayerViewResolverService } from '../player-view-resolver.service';

const playerViewRoutes: Routes = [
	{ path: 'player', component: NoSessionComponent },
	{ path: 'player/:id', component: PlayerViewComponent, resolve: {
		id: PlayerViewResolverService
	} }
]

@NgModule({
  imports: [
    RouterModule.forChild(playerViewRoutes)
  ],
  exports: [
  	RouterModule
  ],
  declarations: [],
  providers: [
  	PlayerViewResolverService
  ]
})
export class PlayerViewRoutingModule { }
