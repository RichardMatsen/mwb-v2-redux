import { NgModule,  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { MaterialModule } from '@angular/material';
import { MatCardModule } from '@angular/material';
import { ModalModule } from 'ngx-bootstrap/modal';

import { FileListComponent } from './file-list/file-list';
import { ResultWrapperComponent } from './result-wrapper';
import { PageCommonComponent } from './page-common.component';
import { SearchComponent } from './search/search.component';
import { SearchResultsModalComponent } from './search/search-results.modal';
import { SearchActions } from './search/search.actions';
import { MigrationWorkBenchCommonModule } from '../../common/mw.common.module';
import { ScrollbarPaddingAdjustDirective } from './file-list/scrollbar-padding-adjust.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    // MaterialModule,
    MatCardModule,
    ModalModule,
    MigrationWorkBenchCommonModule,
  ],
  exports: [
    FileListComponent,
    ResultWrapperComponent,
    PageCommonComponent,
  ],
  declarations: [
    FileListComponent,
    ResultWrapperComponent,
    PageCommonComponent,
    SearchComponent,
    SearchResultsModalComponent,
    ScrollbarPaddingAdjustDirective,
  ],
  entryComponents: [
    SearchResultsModalComponent
  ],
  providers: [
    SearchActions,
  ],
})
export class RevieWPagesCommonModule {}
