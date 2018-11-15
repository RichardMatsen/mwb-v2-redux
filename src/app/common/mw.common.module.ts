import { Component, NgModule, ModuleWithProviders, ModuleWithComponentFactories } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorBadgeComponent } from './badge/error-badge.component';
import { ToastrService } from './toastr/toastr.service';

import { ListLimiterComponent } from './list-limiter/list-limiter.component';
import { StyleWithLess } from './style-with-less.decorator/style-with-less';
import { Logger } from './logger/logger';
import './masked-trim/masked-trim';
import { formatAMPM } from './format-AMPM/format-AMPM';
import { SpinnerComponent } from './spinner/spinner.component';
import { ObjectShapeComparer } from './object-shape-comparer/object-shape-comparer';
import { AmpmPipe } from './ampm-pipe/ampm.pipe';

declare var require;
const maskedTrim = require('./masked-trim/masked-trim');
const dateformat = require('dateformat');

export function loggerFactory() {
  return new Logger('MWB', '');
}

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    ErrorBadgeComponent,
    ListLimiterComponent,
    SpinnerComponent,
    AmpmPipe,
  ],
  declarations: [
    ErrorBadgeComponent,
    ListLimiterComponent,
    SpinnerComponent,
    AmpmPipe,
  ],
  providers: [
    ToastrService,
    { provide: Logger, useFactory: loggerFactory },
    ObjectShapeComparer,
  ],
})
export class MigrationWorkBenchCommonModule {}
export { ToastrService } ;
export { ErrorBadgeComponent };
export { StyleWithLess };
export { Logger };
export { maskedTrim };
export { ListLimiterComponent };
export { formatAMPM };
export { SpinnerComponent };
export { dateformat };
export { AmpmPipe };
