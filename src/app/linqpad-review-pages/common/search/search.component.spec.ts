import 'app/rxjs-extensions';
import { Component, Directive } from '@angular/core';
import { TestBed, ComponentFixture, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';

import { IFileInfo } from 'app/model/fileinfo.model';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';
import { setupMockStore, addtoMockStore } from 'testing-helpers/testing-helpers.module.hlpr';
import { SearchComponent1 } from './search.component.1';
import { SearchActions } from '../../../store/actions/search.actions';
import { SearchService } from './search.service';
import { SearchResultsModalComponent } from './search-results.modal';
const x = require('app/store/selector-helpers/selector-helpers');
import { Computed } from 'app/store/computed/computed-properties';
import { StoreService } from 'app/store/store.service';
import { TestStoreModule } from 'testing-helpers/ngRedux-testing/test-store.module';

const testFiles = [
  { name: 'file1', content: 'xx test xx' },
  { name: 'file2', content: 'xx xx' },
  { name: 'file3', content: 'xx test xx' },
];

describe('SearchComponent', () => {

  let mockActions, mockComputed;
  let fixture: ComponentFixture<SearchComponent1>,
      searchComponent: SearchComponent1,
      location: SpyLocation;

  let store;
  beforeEach(async(() => {

    mockActions = jasmine.createSpyObj('mockActions',
      ['resetResults', 'setPage', 'setSearchTerm', 'setResultsSuccess', 'setResultsFailed']);
    mockComputed = jasmine.createSpyObj('mockComputed', ['visibleFiles$', 'fileCount$']);

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        NgReduxTestingModule,
        ModalModule.forRoot(),
        TestStoreModule
      ],
      declarations: [
        SearchComponent1,
        SearchResultsModalComponent,
      ],
      providers: [
        {provide: SearchActions, useValue: mockActions},
        SearchService,
        {provide: Location, useClass: SpyLocation},
        {provide: Computed, useValue: mockComputed},
        MockNgRedux,
      ],
    }).compileComponents();

    // Instantiate mock store
    store = TestBed.get(StoreService);
    const stub1 = setupMockStore(['search', 'page'], 'validations' );

    location = TestBed.get(Location);
    fixture = TestBed.createComponent(SearchComponent1);
    searchComponent = fixture.componentInstance;
    searchComponent.ngOnInit();
  }));

  const setLocation = (page) => {
    location.go(page);
    searchComponent.ngOnInit();
  };

  it('should create the component', () => {
    expect(searchComponent).toBeTruthy();
  });

  describe('search()', () => {

    beforeEach(() => {
      setLocation('validations');
      mockComputed.visibleFiles$.and.returnValue(Observable.of(testFiles));
    });

    it('should reset previous results', () => {
      searchComponent.search('test');
      expect(mockActions.resetResults).toHaveBeenCalled();
    });

    it('should set search term', () => {
      searchComponent.search('test');
      expect(mockActions.setSearchTerm).toHaveBeenCalledWith('test');
    });

    it('should return if search term is null', () => {
      searchComponent.search(null);
      expect(mockActions.setSearchTerm).not.toHaveBeenCalled();
    });

  });

  describe('page', () => {

    beforeEach(() => {
      mockComputed.visibleFiles$.and.returnValue(Observable.of(testFiles));
    });

    it('should get the page from location', () => {
      setLocation('validations');
      searchComponent.search('test');
      expect(mockActions.setPage).toHaveBeenCalledWith('validations', true);
    });

    it('should not set page if page is not in searchablePages', () => {
      setLocation('notSearchablePage');
      searchComponent.search('test');
      expect(mockActions.setPage).toHaveBeenCalledWith('notSearchablePage', false);
    });

  });

  describe('getResults()', () => {

    beforeEach(() => {
      setLocation('validations');
      mockComputed.visibleFiles$.and.returnValue(Observable.of(testFiles));
    });

    it('should set the search results', fakeAsync(() => {
      searchComponent.search('test');
      tick();
      expect(mockActions.setResultsSuccess).toHaveBeenCalledWith(['file1', 'file3']);
    }));

    it('should set the search results to "no results" is searchTerm is not found', fakeAsync(() => {
      searchComponent.search('testStringNotPresent');
      tick();
      expect(mockActions.setResultsFailed).toHaveBeenCalled();
    }));

    it('should not set search results page is not in searchablePages', () => {
      setLocation('notSearchablePage');
      searchComponent.search('test');
      expect(mockActions.setResultsSuccess).not.toHaveBeenCalled();
    });

    it('should ignore files that have no content', fakeAsync(() => {
      const testFiles2 = [...testFiles,   { name: 'file4', content: null }, null ]
      mockComputed.visibleFiles$.and.returnValue(Observable.of(testFiles2));
      searchComponent.search('test');
      tick();
      expect(mockActions.setResultsSuccess).toHaveBeenCalledWith(['file1', 'file3']);
    }));

  });

  describe('OpenModal', () => {

    it('should show the SearchResultsModal', () => {
      mockComputed.visibleFiles$.and.returnValue(Observable.of(testFiles));
      addtoMockStore(['search'], { searchTerm: 'test', results: testFiles});
      setLocation('validations');

      const mockSearchResultsModal = jasmine.createSpyObj('mockSearchResultsModal', ['show']);
      searchComponent.searchResultsModal = mockSearchResultsModal;

      searchComponent.search('test');
      expect(mockSearchResultsModal.show).toHaveBeenCalled();
    });

  });

});
