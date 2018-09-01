import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { MaterialModule } from '@angular/material';
import { ModalModule } from 'ngx-bootstrap/modal';

import { DataService } from 'app/services/data-service/data.service';
import { ReferentialsComponent } from './referentials.component';
import { ReferentialsResolver } from './services/referentials-resolver';
import { ReferentialsDataService } from './services/referentials-data.service';
import { ReferentialsFormatService } from './services/referentials-format.service';
import { ReferentialsRoutingModule, routedComponents } from './referentials.routing';
import { ListFormatterService } from 'app/services/list-formatter.service/list-formatter.service';
import { ReferentialsActions } from '../../store/actions/referentials.actions';
import { ReviewPagesCommonModule } from '../common/page-common.module';
import { MigrationWorkBenchCommonModule, Logger } from 'app/common/mw.common.module';
import { ReferentialsDiagramComponent } from './referentials-diagram/referentials-diagram.component';
import { ReferentialsDiagramModal } from './referentials-diagram/referentials-diagram.modal.component';
import { ReferentialsGraphComponent } from 'app/graphs/referentials-graph/referentials-graph.component';

export function loggerFactory() {
  return new Logger('Referentials', '');
}

@NgModule({
  imports: [
    CommonModule,
    // MaterialModule,
    ReferentialsRoutingModule,
    ReviewPagesCommonModule,
    MigrationWorkBenchCommonModule,
    ModalModule.forRoot(),
  ],
  exports: [
    ReferentialsComponent,
  ],
  declarations: [
    ReferentialsComponent,
    routedComponents,
    ReferentialsDiagramComponent,
    ReferentialsDiagramModal,
    ReferentialsGraphComponent,
  ],
  providers: [
    { provide: DataService, useClass: ReferentialsDataService},
    ReferentialsDataService,
    ReferentialsFormatService,
    ReferentialsResolver,
    { provide: Logger, useFactory: loggerFactory },
    ReferentialsActions,
    ListFormatterService,
  ],
})
export class ReferentialsModule {}
