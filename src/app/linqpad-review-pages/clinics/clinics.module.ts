import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataService } from 'app/services/data-service/data.service';
import { ClinicsComponent } from './clinics.component';
import { ClinicsResolver } from './services/clinics-resolver';
import { ClinicsDataService } from './services/clinics-data.service';
import { ClinicsFormatService } from './services/clinics-format.service';
import { ClinicsRoutingModule, routedComponents } from './clinics.routing';
import { ListFormatterService } from 'app/services/list-formatter.service/list-formatter.service';
import { ClinicsActions } from 'app/store/actions/clinics.actions';
import { ReviewPagesCommonModule } from '../common/page-common.module';
import { MigrationWorkBenchCommonModule, Logger } from 'app/common/mw.common.module';

export function loggerFactory() {
  return new Logger('Clinics', '');
}

@NgModule({
  imports: [
    CommonModule,
    ClinicsRoutingModule,
    ReviewPagesCommonModule,
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
