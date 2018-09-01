import { NgModule,  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { MaterialModule } from '@angular/material';  // Material components now in separate modules
import { MatCardModule } from '@angular/material';
import { ModalModule } from 'ngx-bootstrap/modal';

import { FileListComponent } from './file-list/file-list';
import { ResultWrapperComponent } from './result-wrapper';
import { PageCommonComponent } from './page-common.component';
import { SearchComponent0 } from './search/search.component.0';
import { SearchComponent1 } from './search/search.component.1';
import { SearchIndicator } from './search-indicator';
import { SearchService } from './search/search.service';
import { SearchResultsModalComponent } from './search/search-results.modal';
import { SearchActions } from '../../store/actions/search.actions';
import { MigrationWorkBenchCommonModule } from 'app/common/mw.common.module';
import { ScrollbarPaddingAdjustDirective } from './file-list/scrollbar-padding-adjust.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    // MaterialModule,  // Material components now in separate modules
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
    SearchComponent0,
    SearchComponent1,
    SearchIndicator,
    SearchResultsModalComponent,
    ScrollbarPaddingAdjustDirective,
  ],
  entryComponents: [
    SearchResultsModalComponent
  ],
  providers: [
    SearchService,
    SearchActions,
  ],
})
export class ReviewPagesCommonModule {}
