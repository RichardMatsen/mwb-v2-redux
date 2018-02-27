import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';

import { IAppState } from '../state/AppState';
import { UiActions } from '../../common/mw.common.module';
import { ToastrService } from '../../common/mw.common.module';

@Injectable()
export class UiMiddleware {

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private uiActions: UiActions,
    private toastr: ToastrService,
  ) {}

  uiMiddlewareFactory() {
    const vm = this;
    return function uiMiddleware(store) {
      return (next) => (action) => {
        if (action.uiStartLoading) {
          vm.uiActions.incrementLoading(action.uiStartLoading);
        }
        if (action.uiEndLoading) {
          vm.uiActions.decrementLoading(action.uiEndLoading);
        }
        if (action.toastr) {
          vm.toastr.info(action.toastr);
        }
        return next(action);
      };
    };
  }
}
