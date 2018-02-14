
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ClinicsComponent} from './clinics.component';
import {ClinicsResolver} from './services/clinics-resolver';

const routes: Routes = [
  { path: 'clinics', component: ClinicsComponent, resolve: { files: ClinicsResolver } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicsRoutingModule { }

export const routedComponents = [ClinicsComponent];
