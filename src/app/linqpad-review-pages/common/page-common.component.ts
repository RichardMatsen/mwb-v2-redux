import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';

import { IFileInfo } from '../../model/fileInfo.model';
import { IAppState } from '../../store/state/AppState';
import { spreadSelector } from '../../store/selector-helpers/spread-selector';
import { Computed } from '../../store/computed/computed-properties';

@Component({
  selector: 'mwb-page-common',
  templateUrl: './page-common.component.html',
  styleUrls: ['./page-common.component.css']
})
export class PageCommonComponent implements OnInit, OnDestroy {

  @Input() config;
  @Input() PAGE;
  @Input() services;

  // State, initialized in onInit via spreadSelector
  fileInfo$;
  numVisible$;
  lastRefresh$;

  // Computed state
  fileCount$;
  visibleFiles$;

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private computed: Computed
  ) {}

  ngOnInit() {
    this.services.page = spreadSelector({self: this}, ['pages', this.PAGE]);
    this.visibleFiles$ = this.computed.visibleFiles$(this.PAGE);
    this.fileCount$ = this.computed.fileCount$(this.PAGE);
  }

  handleFileChange(fileInfo: IFileInfo) {
    this.services.actions.changeFile(fileInfo, this.PAGE);
  }

  handleNumDisplayedChange(numToDisplay: number) {
    this.services.dataService.updateList(numToDisplay);
  }

  refresh() {
    this['fileInfo$'].take(1).subscribe(fileInfo => {
      this.services.dataService.getContent(fileInfo).subscribe(refreshed => {
        this.services.actions.refresh(refreshed);
      });
    });
  }

  ngOnDestroy() {
    this.services.page.unsubscribe();
  }

}
