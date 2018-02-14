import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { Location } from '@angular/common';
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../store/state/AppState';
import { IFileInfo } from '../../../model/fileInfo.model';
import { SearchResultsModalComponent } from './search-results.modal';
import { SearchActions } from './search.actions';
import { } from '../../../store/selector-helpers/selector-helpers';

@Component({
  selector: 'app-search',
  template: `
    <form id="searchForm" #searchForm="ngForm" (ngSubmit)="search(searchTerm)" novalidate class="form-horizontal" role="form">
      <div class="input-group">
          <input [(ngModel)]="searchTerm" name="searchTerm" id="searchTerm" required type="text" class="form-control input-sm"
            [disabled]="searchDisabled" [placeholder]="searchDisabled ? 'Search not available' : 'Search for text'" >
        <span class="input-group-btn">
          <button class="btn btn-sm btn-outline-info" [disabled]="searchForm.controls.searchTerm?.invalid || searchDisabled">
            Search
          </button>
        </span>
      </div>
    </form>
    <search-results-modal></search-results-modal>
  `,
  styles: ['div.input-group { width: 250px; }']
})
export class SearchComponent {

  @ViewChild(SearchResultsModalComponent) searchResultsModal: SearchResultsModalComponent;
  @select(['search']) search$: Observable<any>;

  public searchTerm;
  public searchDisabled = false;
  private readonly searchablePages = ['validations', 'referentials', 'clinics'];

  constructor(
    public location: Location,
    private ngRedux: NgRedux<IAppState>,
    private searchActions: SearchActions
  ) {}

  search(searchTerm: string) {
    if (!searchTerm) {
      return;
    }

    this.searchTerm = searchTerm;
    this.searchActions.resetResults();
    this.searchActions.setSearchTerm(this.searchTerm);

    const pageType = this.getPage();
    if (!pageType.isSearchable) {
      return;
    }

    this.getResults(this.searchTerm, pageType);
    this.openModal();
  }

  private getResults(searchTerm, pageType) {
    const visibleFiles$ = this.ngRedux.select<IFileInfo[]>(['pages', pageType.page, 'visibleFiles']);
    visibleFiles$
      .map(files => files.filter(file => this.seachFileInfo(file, searchTerm)) )
      .map(files => files.map(file => file.name))
      .subscribe(results => {
        if (results.length > 0) {
          this.searchActions.setResultsSuccess(results);
        } else {
          this.searchActions.setResultsFailed();
        }
      });
  }

  private getPage(): { page: string, isSearchable: boolean} {
    const page = this.location.path().replace('/', '');
    const isSearchable = this.searchablePages.indexOf(page) > -1;
    this.searchActions.setPage(page, isSearchable);
    return {page, isSearchable};
  }

  private seachFileInfo(file, searchTerm): boolean {
    if (!file || !file.content) {
      return false;
    }
    const index = file.content.toLocaleLowerCase().indexOf(searchTerm.toLocaleLowerCase());
    return (index > -1);
  }

  private openModal() {
    this.search$
      .waitForWithCondition$((search) => !!search.results && search.results.length > 0)
      .subscribe(search => {
        this.searchResultsModal.searchTerm = search.searchTerm;
        this.searchResultsModal.results = search.results;
        this.searchResultsModal.show();
      });
  }

}
