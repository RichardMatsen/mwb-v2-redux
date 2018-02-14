
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReferentialsComponent } from './referentials.component';
import { ReferentialsResolver } from './services/referentials-resolver';

const routes: Routes = [
  { path: 'referentials', component: ReferentialsComponent, resolve: { files: ReferentialsResolver } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferentialsRoutingModule { }

export const routedComponents = [ReferentialsComponent];
