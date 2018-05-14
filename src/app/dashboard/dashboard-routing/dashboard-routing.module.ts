import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from '../dashboard.component';
import { NewSessionComponent } from '../new-session/new-session.component';

import { SessionResolverService } from '../session-resolver.service';

const dashboardRoutes: Routes = [
	{ path: 'dashboard', component: NewSessionComponent },
	{ path: 'dashboard/:id', component: DashboardComponent, resolve: {
		id: SessionResolverService
	} }
]

@NgModule({
  imports: [
    RouterModule.forChild(dashboardRoutes)
  ],
  exports: [
  	RouterModule
  ],
  declarations: [],
  providers: [
  	SessionResolverService
  ]
})
export class DashboardRoutingModule { }
