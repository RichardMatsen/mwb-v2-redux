import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { MaterialModule } from '@angular/material';

import { DataService } from '../../services/data-service/data.service';
import { ValidationsComponent } from './validations.component';
import { ValidationsResolver } from './services/validations-resolver';
import { ValidationsDataService } from './services/validations-data.service';
import { ValidationsFormatService } from './services/validations-format.service';
import { ValidationsRoutingModule, routedComponents } from './validations.routing';
import { ListFormatterService } from '../../services/list-formatter.service/list-formatter.service';
import { ValidationsActions } from './services/validations.actions';
import { RevieWPagesCommonModule } from '../common/page-common.module';
import { MigrationWorkBenchCommonModule, Logger } from '../../common/mw.common.module';

export function loggerFactory() {
  return new Logger('Validations', '');
}

@NgModule({
  imports: [
    CommonModule,
    // MaterialModule,
    ValidationsRoutingModule,
    RevieWPagesCommonModule,
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
