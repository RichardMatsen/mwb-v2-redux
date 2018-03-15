import { Injectable } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../state/AppState';
import { IFileInfo } from '../../model/fileInfo.model';

@Injectable()
export class Computed {

  constructor(
    private ngRedux: NgRedux<IAppState>
  ) {}

  visibleFiles$(page): Observable<IFileInfo[]> {
    return this.ngRedux.select<IFileInfo[]>(this.visibleFiles(page));
  }

  private visibleFiles = (page) => (state) => {
    const files = state.pages[page].files || [];
    const numVisible = state.pages[page].numVisible || 0;
    return files.slice(0, numVisible);
  }

  fileCount$(page): Observable<number> {
    return this.ngRedux.select<number>(this.fileCount(page));
  }

  private fileCount = (page) => (state) => {
    const files = state.pages[page].files || [];
    return files.length;
  }

}
