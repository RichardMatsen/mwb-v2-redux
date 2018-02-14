import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModalModule } from 'ngX-bootstrap/modal';

import { NavBarComponent } from './navbar.component';
import { NavigationSpinnerComponent } from './navigation-spinner.component';
import { ServicesModule } from '../services/services.module';
import { DashboardComponent } from '../dashboard/dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ServicesModule,
  ],
  exports: [
    NavBarComponent
  ],
  declarations: [
    NavBarComponent,
    NavigationSpinnerComponent,
  ],
})
export class NavModule { }
