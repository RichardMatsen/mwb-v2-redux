import { Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';

import { IAppState } from 'app/store/state/AppState';
import { IFileInfo } from 'app/model/fileInfo.model';
import { formatAMPM } from 'app/common/mw.common.module';
// import { PageActionType } from 'app/store/actionTypes/pageActionType';
import { PageState } from '../state/page.state';

export interface PageActionType {
  type: string;
  payload?: PageState | Error | { currentPage: string };  // Constrain the payload properties to match those on state
  subState?: string;            // Reducer will act on named substate property only
  uiStartLoading?: string;     // Indicate to UiMiddleware to increment spinner counter
  uiEndLoading?: string;       // Indicate to UiMiddleware to decrement spinner counter
  toastr?: string;             // Indicate to UiMiddleware to emit toastr message
  typeModifier?: Function;     // Change the action type text in reducer (for clearer logging)
  excludeFromLog?: boolean;    // Devtools enhancer will filter this action from the log
}

@Injectable()
export abstract class PageActions {

  static INITIALIZE_FILES_REQUEST = 'INITIALIZE_FILES_REQUEST';
  static SET_CURRENT_PAGE  = 'SET_CURRENT_PAGE';
  static INITIALIZE_FILES_SUCCESS = 'INITIALIZE_FILES_SUCCESS';
  static INITIALIZE_FILES_FAILED = 'INITIALIZE_FILES_FAILED';
  static UPDATE_FILES_REQUEST = 'UPDATE_FILES_REQUEST';
  static UPDATE_FILES_SUCCESS = 'UPDATE_FILES_SUCCESS';
  static UPDATE_FILES_FAILED = 'UPDATE_FILES_FAILED';
  static SET_NUM_VISIBLE = 'SET_NUM_VISIBLE';
  static CHANGE_FILE = 'CHANGE_FILE';
  static RELOAD_FILE = 'RELOAD_FILE';
  static SET_LAST_REFRESH = 'SET_LAST_REFRESH';
  static ACTIONS = [
    PageActions.SET_CURRENT_PAGE,
    PageActions.INITIALIZE_FILES_REQUEST,
    PageActions.INITIALIZE_FILES_SUCCESS,
    PageActions.INITIALIZE_FILES_FAILED,
    PageActions.UPDATE_FILES_REQUEST,
    PageActions.UPDATE_FILES_SUCCESS,
    PageActions.UPDATE_FILES_FAILED,
    PageActions.SET_NUM_VISIBLE,
    PageActions.CHANGE_FILE,PageActions.RELOAD_FILE,
    PageActions.SET_LAST_REFRESH 
  ];

  abstract PAGE: string;

  constructor(
    protected ngRedux: NgRedux<IAppState>,
  ) {}

  createSetCurrentPage(page: string): PageActionType {
    return {
      type: PageActions.SET_CURRENT_PAGE,
      payload: {
        currentPage: page
      }
    };
  }
  setCurrentPage(page: string) {
    this.ngRedux.dispatch( this.createSetCurrentPage(page) );
  }

  createInitializeListRequest(): PageActionType {
    // Used to activate the spinner on start of page load
    return {
      type: PageActions.INITIALIZE_FILES_REQUEST,
      subState: this.PAGE,
      uiStartLoading: `initialize_${this.PAGE}`,
      excludeFromLog: true,
    };
  }
  initializeListRequest() {
    this.ngRedux.dispatch( this.createInitializeListRequest() );
  }

  createInitializeListSuccess( files: IFileInfo[], numToDisplay: number): PageActionType {
    return {
      type: PageActions.INITIALIZE_FILES_SUCCESS,
      subState: this.PAGE,
      uiEndLoading: `initialize_${this.PAGE}_success`,
      payload: {
        files,
        fileInfo: files[0],
        numVisible: numToDisplay,
        lastRefresh: formatAMPM(new Date())
      }
    };
  }
  initializeListSuccess(files: IFileInfo[], numToDisplay: number) {
    this.ngRedux.dispatch( this.createInitializeListSuccess(files, numToDisplay) );
  }

  createInitializeListFailed(error: Error): PageActionType {
    return {
      type: PageActions.INITIALIZE_FILES_FAILED,
      subState: this.PAGE,
      uiEndLoading: `update_${this.PAGE}_fail`,
      payload: {
        error
      }
    };
  }
  initializeListFailed(error: Error) {
    this.ngRedux.dispatch( this.createInitializeListFailed(error) );
  }

  createUpdateListRequest(): PageActionType {
    return {
      type: PageActions.UPDATE_FILES_REQUEST,
      subState: this.PAGE,
      uiStartLoading: `update_${this.PAGE}`,
      excludeFromLog: true,
    };
  }
  updateListRequest() {
    this.ngRedux.dispatch( this.createUpdateListRequest() );
  }

  createUpdateListSuccess(files: IFileInfo[], numToDisplay: number): PageActionType {
    return {
      type: PageActions.UPDATE_FILES_SUCCESS,
      subState: this.PAGE,
      uiEndLoading: `update_${this.PAGE}_success`,
      payload: {
        files,
        numVisible: numToDisplay,
        lastRefresh: formatAMPM(new Date()),
      },
    };
  }
  updateListSuccess(files: IFileInfo[], numToDisplay: number) {
    this.ngRedux.dispatch( this.createUpdateListSuccess(files, numToDisplay) );
  }

  createUpdateListFailed(error) {
    return {
      type: PageActions.UPDATE_FILES_FAILED,
      subState: this.PAGE,
      uiEndLoading: `update_${this.PAGE}_fail`,
      payload: {
        error
      },
    };
  }
  updateListFailed(error) {
    this.ngRedux.dispatch( this.createUpdateListFailed(error) );
  }

  createChangeFile(fileInfo: IFileInfo): PageActionType {
    return {
      type: PageActions.CHANGE_FILE,
      subState: this.PAGE,
      payload: {
        fileInfo,
        lastRefresh: formatAMPM(new Date()),
      },
    };
  }
  changeFile(fileInfo: IFileInfo) {
    this.ngRedux.dispatch( this.createChangeFile(fileInfo) );
  }

  createRefresh(fileInfo: IFileInfo): PageActionType {
    return {
      type: PageActions.RELOAD_FILE,
      subState: this.PAGE,
      payload: {
        fileInfo,
        lastRefresh: formatAMPM(new Date()),
      },
    };
  }
  refresh(fileInfo: IFileInfo) {
    this.ngRedux.dispatch( this.createRefresh(fileInfo) );
  }

  createSetNumToDisplay(numToDisplay: number): PageActionType {
    return {
      type: PageActions.SET_NUM_VISIBLE,
      subState: this.PAGE,
      payload: {
        numVisible: numToDisplay,
      },
    };
  }
  setNumToDisplay(numToDisplay: number) {
    this.ngRedux.dispatch( this.createSetNumToDisplay(numToDisplay) );
  }

  createSetLastRefresh(): PageActionType {
    return {
      type: PageActions.SET_LAST_REFRESH,
      subState: this.PAGE,
      payload: {
        lastRefresh: formatAMPM(new Date()),
      },
    };
  }
  setLastRefresh() {
    this.ngRedux.dispatch( this.createSetLastRefresh() );
  }

}
