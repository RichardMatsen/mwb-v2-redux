import { Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';

import { IAppState } from 'app/store/state/AppState';
import { IFileInfo } from 'app/model/fileInfo.model';

@Injectable()
export class FileActions {

  static SET_FILELIST_PENDING = 'SET_FILELIST_PENDING';
  static SET_FILELIST_SUCCESS = 'SET_FILELIST_SUCCESS';
  static SET_FILELIST_FAILED = 'SET_FILELIST_FAILED';
  static ACTIONS = [
    FileActions.SET_FILELIST_PENDING,
    FileActions.SET_FILELIST_SUCCESS,
    FileActions.SET_FILELIST_FAILED
  ];

  constructor(
    protected ngRedux: NgRedux<IAppState>,
  ) {}

  createSetFileListPending(value) {
    return {
      type: FileActions.SET_FILELIST_PENDING,
      payload: {
        fileList: {
          pending: value
        }
      }
    };
  }
  setFileListPending(value) {
    this.ngRedux.dispatch( this.createSetFileListPending(value) );
  }

  createSetFileListSuccess(files: string[]) {
    return {
      type: FileActions.SET_FILELIST_SUCCESS,
      payload: {
        fileList: {
          files,
          pending: false,
          error: null
        }
      }
    };
  }
  setFileListSuccess(files: string[]) {
    this.ngRedux.dispatch( this.createSetFileListSuccess(files) );
  }

  createSetFileListFailed(error: Error) {
    return {
      type: FileActions.SET_FILELIST_SUCCESS,
      payload: {
        fileList: {
          error
        }
      }
    };
  }
  setFileListFailed(error: Error) {
    this.ngRedux.dispatch( this.createSetFileListFailed(error) );
  }
}
