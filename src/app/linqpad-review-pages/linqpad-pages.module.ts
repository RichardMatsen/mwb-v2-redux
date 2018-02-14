import { NgModule } from '@angular/core';

import { ValidationsModule } from './validations/validations.module';
import { ReferentialsModule } from './referentials/referentials.module';
import { ClinicsModule } from './clinics/clinics.module';

@NgModule({
  imports: [
    ValidationsModule,
    ReferentialsModule,
    ClinicsModule,
  ],
})
export class LinqpadPagesModule {
}
