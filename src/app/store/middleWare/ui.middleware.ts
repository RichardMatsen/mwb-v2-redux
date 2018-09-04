import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';

import { IAppState } from '../state/AppState';
import { UiActions } from 'app/store/actions/ui.actions';
import { ToastrService } from 'app/common/mw.common.module';

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
          const trigger = typeof action.uiStartLoading === 'string' ? action.uiStartLoading : action.type;
          vm.uiActions.incrementLoading(trigger);
        }
        if (action.uiEndLoading) {
          const trigger = typeof action.uiEndLoading === 'string' ? action.uiEndLoading : action.type;
          vm.uiActions.decrementLoading(trigger);
        }
        if (action.toastr) {
          vm.toastr.info(action.toastr);
        }
        return next(action);
      };
    };
  }
}
