import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthguardService } from './nav/authguard.service';
import { Error404PageComponent } from './nav/four-0-four/404-component';
import { TasksComponent } from './tasks/tasks.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'dashboard',  pathMatch: 'full' },
  // { path: 'dashboard', canActivate: [AuthguardService], component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'tasks', canActivate: [AuthguardService], component: TasksComponent, data: { toastrPrompt: 'Team Tasks'} },
  { path: '404', component: Error404PageComponent },
  { path: 'user', loadChildren: 'app/user/user.module#UserModule' },
  { path: '**', redirectTo: '404',  pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes),
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    Error404PageComponent,
  ],
  providers: [
    AuthguardService,
 ],
})
export class AppRoutingModule {
}
