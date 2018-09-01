import 'app/rxjs-extensions';

import { Injectable } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import * as deepEqual from 'deep-equal';

import { IAppState } from 'app/store/state/AppState';
import { IFileInfo } from 'app/model/fileInfo.model';

@Injectable()
export class Computed {

  @select(['search', 'page']) page$;

  constructor(
    private ngRedux: NgRedux<IAppState>
  ) {}

  visibleFiles$(page): Observable<IFileInfo[]> {
    return this.ngRedux.select<IFileInfo[]>(this.visibleFiles(page), this.compareArrays);
  }

  private visibleFiles = (page) => (state) => {
    const files = state.pages[page].files || [];
    const numVisible = state.pages[page].numVisible || 0;
    return files.slice(0, numVisible);
  }

  private compareArrays(oldVal, newVal) {
    return deepEqual(oldVal, newVal);
  }

  fileCount$(page): Observable<number> {
    return this.ngRedux.select<number>(this.fileCount(page));
  }

  private fileCount = (page) => (state) => {
    const files = state.pages[page].files || [];
    return files.length;
  }
}
