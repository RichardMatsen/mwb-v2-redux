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
  selector: 'mwb-search-0',
  template: `
    <form id="searchForm" #searchForm="ngForm" (ngSubmit)="search(searchTerm)" novalidate class="form-horizontal" role="form">

      <div class="input-group">
        <input name="searchTerm" id="searchTerm" required type="text" 
          class="form-control input-sm"
          [(ngModel)]="searchTerm"
          (input)="onSearchChange($event.target.value)"
          autocomplete="off"
          [disabled]="searchDisabled"
          [placeholder]="searchDisabled ? 'Search not available' : 'Search for text'" >
        <button *ngIf="searchTerm" type="reset" class="btn reset">
          <i class="fa fa-times-circle" (click)="searchClear()" aria-hidden="true"></i>
        </button>
        <button class="btn btn-sm btn-outline-info search" [disabled]="cannotSearch()">
          Search
        </button>
      </div>
    </form>
    <search-results-modal [(visible)]="showModal"></search-results-modal>
  `,
  styles: [
    `div.input-group {
      width: 200px;
      margin-right: 15px;
      display: flex;
      flex-flow: row;
      justify-content: flex-start;
    }`,
    `input#searchTerm {
      margin: auto;
    }`,
    `button.btn.search {
      margin: auto;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }`,
    `button.btn.reset {
      margin: auto;
      background: none;
      position: absolute;
      top: -0.1em;
      right: 4em;
      z-index: 9;
      outline: 0;
    }`,
    `button.btn.reset:focus {
      outline: 0;
    }`,
    `.fa-times-circle {
      color: red;
      opacity: 50%;
      cursor: pointer;
    }`,
  ]
})
export class SearchComponent0 implements OnInit {

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
    console.log('searchClear')
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
