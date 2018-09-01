import 'app/rxjs-extensions';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';

import { StoreService, select } from 'app/store/store.service';
import { IAppState } from 'app/store/state/AppState';
import { IFileInfo } from 'app/model/fileInfo.model';
import { SearchResultsModalComponent } from './search-results.modal';
import { SearchService } from './search.service';
import 'app/store/selector-helpers/selector-helpers';

@Component({
  selector: 'mwb-search',
  template: `
    <form id="searchForm" #searchForm="ngForm" (ngSubmit)="search(searchTerm)" novalidate class="form-horizontal" role="form">
      <div class="InputAddOn">
          <input name="searchTerm" id="searchTerm" type="text"
            class="InputAddOn-field"
            [(ngModel)]="searchTerm"
            (input)="onSearchChange($event.target.value)"
            autocomplete="off"
            [disabled]="searchDisabled"
            [placeholder]="searchDisabled ? 'Search not available' : 'Search for text'" >
          <span class="InputAddOn-item reset">
            <i *ngIf="searchTerm" class="fa fa-times-circle" (click)="searchClear()" aria-hidden="true"></i>
          </span>
          <button class="InputAddOn-item search"
            [disabled]="cannotSearch()">
            Search
          </button>
      </div>
    </form>
    <search-results-modal [(visible)]="showModal"></search-results-modal>
  `,
  styles: [
    `.InputAddOn {
      display: flex;
    }
    .InputAddOn-field {
      flex: 1;
      /* field styles */
    }
    span.reset {
      margin: auto;
      background: none;
      position: absolute;
      top: 6em;
      right: 6em;
      z-index: 9;
      outline: 0;
    }
    span.reset:focus {
      outline: 0;
    }`,
    `.fa-times-circle {
      color: red;
      opacity: 0.5;
      cursor: pointer;
    }`,
  ]
})
export class SearchComponent1 implements OnInit {

  @ViewChild(SearchResultsModalComponent) searchResultsModal: SearchResultsModalComponent;
  @select(['search']) search$: Observable<any>;

  public searchTerm;
  public searchDisabled = false;
  private readonly searchablePages = ['validations', 'referentials', 'clinics'];
  private page: string;
  private isSearchable: boolean;
  showModal = false;

  constructor(
    public location: Location,
    private searchService: SearchService,
    private store: StoreService
  ) {}

  ngOnInit() {
    const pageType = this.getPage();
    this.page = pageType.page;
    this.isSearchable = pageType.isSearchable;
  }

  onSearchChange(searchTerm: string) {
    this.searchService.setSearchTerm(searchTerm);
  }

  search(searchTerm: string) {
    if (!searchTerm || !this.isSearchable) {
      return;
    }
    this.searchService.search(searchTerm);
    this.openModal();
  }

  searchClear() {
    this.searchTerm = '';
    this.searchService.clearResults();
  }

  cannotSearch() {
    return this.searchDisabled || !this.searchTerm;
  }

  private getPage(): { page: string, isSearchable: boolean} {
    const page = this.location.path().replace('/', '');
    const isSearchable = this.searchablePages.indexOf(page) > -1;
    this.store.actions.searchActions.setPage(page, isSearchable);
    return {page, isSearchable};
  }

  private openModal() {
    this.search$
      .waitForWithCondition$((search) => !!search.results && search.results.length > 0)
      .subscribe(search => {
        this.showModal = true;
        this.searchResultsModal.searchTerm = search.searchTerm;
        this.searchResultsModal.results = search.results;
        this.searchResultsModal.show();
      });
  }

}
