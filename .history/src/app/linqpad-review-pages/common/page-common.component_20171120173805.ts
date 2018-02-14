import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';

import { IFileInfo } from '../../model/FileInfo';
import { IAppState } from '../../store/state/AppState';
import { spreadSelector } from '../../store/selector-helpers/spread-selector';

@Component({
  selector: 'page-common',
  templateUrl: './page-common.component.html',
  styleUrls: ['./page-common.component.css']
})
export class PageCommonComponent implements OnInit, OnDestroy {

  @Input() config;
  @Input() PAGE;
  @Input() services;

  fileInfo$;
  visibleFiles$;
  numVisible$;
  fileCount$;
  lastRefresh$;
  start;
  
  constructor(
    private ngRedux: NgRedux<IAppState>,
  ) {}

  ngOnInit() {
    this.services.page = spreadSelector({self: this}, ['pages', this.PAGE]);
    this.start = new Date()
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
