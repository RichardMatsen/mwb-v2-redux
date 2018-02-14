import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidationsComponent } from './validations.component';
import { ValidationsResolver } from './services/validations-resolver';

const routes: Routes = [
  { path: 'validations', component: ValidationsComponent, resolve: { files: ValidationsResolver } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidationsRoutingModule { }

export const routedComponents = [ValidationsComponent];
