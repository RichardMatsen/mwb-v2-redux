import 'app/rxjs-extensions';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as Mark from 'mark.js';

import { StoreService, select } from 'app/store/store.service';
import { IAppState } from 'app/store/state/AppState';
import { waitFor$ } from 'app/store/selector-helpers/selector-helpers';

@Injectable()
export class SearchService {

  @select(['search', 'page']) page$;
  @select(['search', 'searchTerm']) searchTerm$;
  fileInfo$;

  constructor(
    private store: StoreService
  ) {
    this.page$.waitFor$().subscribe(page => {
      this.fileInfo$ = this.store.select(['pages', page, 'fileInfo']);
    });
  }

  public search(searchTerm) {
    this.store.actions.searchActions.resetResults();
    this.store.actions.searchActions.setSearchTerm(searchTerm);
    this.getResults(searchTerm);
  }

  public getResults(searchTerm) {
    this.page$
      .mergeMap(page => this.store.computed.visibleFiles$(page))
      .take(1)
      .map(files => files.filter(file => this.searchFile(file, searchTerm)))
      .map(files => files.map(file => file.name))
      .subscribe(results => {
        if (results.length > 0) {
          this.store.actions.searchActions.setResultsSuccess(results);
        } else {
          this.store.actions.searchActions.setResultsFailed();
        }
      });
  }

  public clearResults() {
    this.store.actions.searchActions.resetResults();
  }

  public setSearchTerm(searchTerm: string) {
    this.store.actions.searchActions.setSearchTerm(searchTerm);
  }

  public searchFile(file, searchTerm): boolean {
    if (!file || !file.content) {
      return false;
    }
    const count = this.getMatches(file, searchTerm);
    return count > 0;
  }

  private getMatches = (file, searchTerm) => {
    let count = 0;
    const div = document.createElement('div');
    div.innerHTML = file.content;
    const instance = new Mark(div);
    instance.mark(searchTerm, { done: (matchCount) => count = matchCount });
    return count;
  }
}
