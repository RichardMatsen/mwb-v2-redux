import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { StoreService, select } from 'app/store/store.service';
import { IFileInfo } from 'app/model/fileInfo.model';
import { IAppState } from 'app/store/state/AppState';
import { spreadSelector } from 'app/store/selector-helpers/spread-selector';
import { SearchResultsModalComponent } from './search/search-results.modal';

@Component({
  selector: 'mwb-page-common',
  templateUrl: './page-common.component.html',
  styleUrls: ['./page-common.component.css']
})
export class PageCommonComponent implements OnInit, OnDestroy {

  @ViewChild(SearchResultsModalComponent) searchResultsModal: SearchResultsModalComponent;

  @Input() config;
  @Input() PAGE;
  @Input() services;

  // State, initialized in onInit via spreadSelector
  fileInfo$;
  numVisible$;
  lastRefresh$;

  searchCount$ = this.store.select(['search', 'searchCount']);

  // Computed state
  fileCount$;
  visibleFiles$;

  constructor(
    private store: StoreService
  ) {}

  ngOnInit() {
    spreadSelector({self: this, baseSelector: ['pages', this.PAGE]});
    this.visibleFiles$ = this.store.computed.visibleFiles$(this.PAGE);
    this.fileCount$ = this.store.computed.fileCount$(this.PAGE);
  }

  handleFileChange(fileInfo: IFileInfo) {
    this.services.actions.changeFile(fileInfo, this.PAGE);
  }

  handleNumDisplayedChange(numToDisplay: number) {
    this.services.dataService.updateList(numToDisplay);
  }

  refresh() {
    this.fileInfo$.take(1).subscribe(fileInfo => {
      this.services.dataService.getContent(fileInfo).subscribe(refreshed => {
        this.services.actions.refresh(refreshed);
      });
    });
  }

  ngOnDestroy() {
  }

}
