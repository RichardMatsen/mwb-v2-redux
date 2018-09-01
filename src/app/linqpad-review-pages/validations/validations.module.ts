import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { MaterialModule } from '@angular/material';

import { DataService } from 'app/services/data-service/data.service';
import { ValidationsComponent } from './validations.component';
import { ValidationsResolver } from './services/validations-resolver';
import { ValidationsDataService } from './services/validations-data.service';
import { ValidationsFormatService } from './services/validations-format.service';
import { ValidationsRoutingModule, routedComponents } from './validations.routing';
import { ListFormatterService } from 'app/services/list-formatter.service/list-formatter.service';
import { ValidationsActions } from 'app/store/actions/validations.actions';
import { ReviewPagesCommonModule } from '../common/page-common.module';
import { MigrationWorkBenchCommonModule, Logger } from 'app/common/mw.common.module';

export function loggerFactory() {
  return new Logger('Validations', '');
}

@NgModule({
  imports: [
    CommonModule,
    // MaterialModule,
    ValidationsRoutingModule,
    ReviewPagesCommonModule,
    MigrationWorkBenchCommonModule,
  ],
  exports: [
    ValidationsComponent,
  ],
  declarations: [
    ValidationsComponent,
    routedComponents,
  ],
  providers: [
    { provide: DataService, useClass: ValidationsDataService},
    ValidationsDataService,
    ValidationsFormatService,
    ValidationsResolver,
    { provide: Logger, useFactory: loggerFactory },
    ValidationsActions,
    ListFormatterService,
  ],
})
export class ValidationsModule {}
