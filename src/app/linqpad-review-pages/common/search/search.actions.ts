import { Injectable,  } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from 'redux';
import { NgRedux, select, } from '@angular-redux/store';
import { IAppState } from '../../../store/state/AppState';
import { SearchActionType } from '../../../store/actions/searchActionType';
import { searchInitialState } from '../../../store/state/search.state';

@Injectable()
export class SearchActions {

  static RESET_RESULTS = 'RESET_RESULTS';
  static SET_PAGE = 'SET_PAGE';
  static SET_SEARCHTERM = 'SET_SEARCHTERM';
  static SET_RESULTS_SUCCESS = 'SET_RESULTS_SUCCESS';
  static SET_RESULTS_FAILED = 'SET_RESULTS_FAILED';
  static ACTIONS = [SearchActions.RESET_RESULTS, SearchActions.SET_PAGE, SearchActions.SET_SEARCHTERM,
    SearchActions.SET_RESULTS_SUCCESS, SearchActions.SET_RESULTS_FAILED, ];

  static NO_RESULTS_MESSAGE = 'No results found';

  constructor(
    private ngRedux: NgRedux<IAppState>,
  ) {}

  createResetResults(): SearchActionType {
    return {
      type: SearchActions.RESET_RESULTS,
      payload: searchInitialState
    };
  }
  resetResults() {
    this.ngRedux.dispatch(this.createResetResults());
  }

  createSetPage(page, pageIsSearchable): SearchActionType {
    return {
      type: SearchActions.SET_PAGE,
      payload: {
        page,
        pageIsSearchable
      }
    };
  }
  setPage(page, pageIsSearchable) {
    this.ngRedux.dispatch(this.createSetPage(page, pageIsSearchable));
  }

  createSetSearchTerm(searchTerm: string): SearchActionType {
    return {
      type: SearchActions.SET_SEARCHTERM,
      payload: {
        searchTerm
      }
    };
  }
  setSearchTerm(searchTerm: string) {
    this.ngRedux.dispatch(this.createSetSearchTerm(searchTerm));
  }

  createSetResultsSuccess(results: string[]): SearchActionType {
    return {
      type: SearchActions.SET_RESULTS_SUCCESS,
      payload: {
        results
      }
    };
  }
  setResultsSuccess(results: string[]) {
    this.ngRedux.dispatch(this.createSetResultsSuccess(results));
  }

  createSetResultsFailed(): SearchActionType {
    return {
      type: SearchActions.SET_RESULTS_FAILED,
      payload: {
        results: [SearchActions.NO_RESULTS_MESSAGE]
      }
    };
  }
  setResultsFailed() {
    this.ngRedux.dispatch(this.createSetResultsFailed());
  }
}
