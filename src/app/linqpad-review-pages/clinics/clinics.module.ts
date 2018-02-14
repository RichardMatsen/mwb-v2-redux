import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { MaterialModule } from '@angular/material';

import { DataService } from '../../services/data-service/data.service';
import { ClinicsComponent } from './clinics.component';
import { ClinicsResolver } from './services/clinics-resolver';
import { ClinicsDataService } from './services/clinics-data.service';
import { ClinicsFormatService } from './services/clinics-format.service';
import { ClinicsRoutingModule, routedComponents } from './clinics.routing';
import { ListFormatterService } from '../../services/list-formatter.service/list-formatter.service';
import { ClinicsActions } from './services/clinics.actions';
import { RevieWPagesCommonModule } from '../common/page-common.module';
import { MigrationWorkBenchCommonModule, Logger } from '../../common/mw.common.module';

export function loggerFactory() {
  return new Logger('Clinics', '');
}

@NgModule({
  imports: [
    CommonModule,
    // MaterialModule,
    ClinicsRoutingModule,
    RevieWPagesCommonModule,
    MigrationWorkBenchCommonModule
  ],
  exports: [
    ClinicsComponent,
  ],
  declarations: [
    ClinicsComponent,
    routedComponents,
  ],
  providers: [
    { provide: DataService, useClass: ClinicsDataService},
    ClinicsDataService,
    ClinicsFormatService,
    ClinicsResolver,
    { provide: Logger, useFactory: loggerFactory },
    ClinicsActions,
    ListFormatterService,
  ],
})
export class ClinicsModule {}
