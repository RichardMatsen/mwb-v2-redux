import { Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';

import { IAppState } from '../../store/state/AppState';
import { IFileInfo } from '../../model/FileInfo';
import { formatAMPM } from '../../common/mw.common.module';
import { PageActionType } from '../../store/state/action-types';

@Injectable()
export abstract class PageActions {

  static INITIALIZE_FILES_REQUEST = 'INITIALIZE_FILES_REQUEST';
  static INITIALIZE_FILES_SUCCESS = 'INITIALIZE_FILES_SUCCESS';
  static INITIALIZE_FILES_FAILED = 'INITIALIZE_FILES_FAILED';
  static UPDATE_FILES_REQUEST = 'UPDATE_FILES_REQUEST';
  static UPDATE_FILES_SUCCESS = 'UPDATE_FILES_SUCCESS';
  static UPDATE_FILES_FAILED = 'UPDATE_FILES_FAILED';
  static SET_NUM_VISIBLE = 'SET_NUM_VISIBLE';
  static CHANGE_FILE = 'CHANGE_FILE';
  static RELOAD_FILE = 'RELOAD_FILE';
  static SET_LAST_REFRESH = 'SET_LAST_REFRESH';
  static ACTIONS = [PageActions.INITIALIZE_FILES_REQUEST, PageActions.INITIALIZE_FILES_SUCCESS, PageActions.INITIALIZE_FILES_FAILED,
                    PageActions.UPDATE_FILES_REQUEST, PageActions.UPDATE_FILES_SUCCESS, PageActions.UPDATE_FILES_FAILED,
                    PageActions.SET_NUM_VISIBLE, PageActions.CHANGE_FILE, PageActions.RELOAD_FILE, PageActions.SET_LAST_REFRESH ];

  abstract PAGE: string;

  // actionTypePattern = (type) => `[PAGE] ${type} / ${this.PAGE}`;

  constructor(
    protected ngRedux: NgRedux<IAppState>,
  ) {}

  createInitializeListRequest(): PageActionType {
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
        fileCount: files.length,
        numVisible: numToDisplay,
        visibleFiles: files.slice(0, numToDisplay),
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
        fileCount: files.length,
        numVisible: numToDisplay,
        visibleFiles: files.slice(0, numToDisplay),
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
        visibleFiles: this.calcVisibleFiles(numToDisplay),
      },
    };
  }
  setNumToDisplay(numToDisplay: number) {
    this.ngRedux.dispatch( this.createSetNumToDisplay(numToDisplay) );
  }

  protected calcVisibleFiles(numToDisplay): IFileInfo[] {
    return this.ngRedux.getState()
      .pages[this.PAGE].files
      .slice(0, numToDisplay);
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
