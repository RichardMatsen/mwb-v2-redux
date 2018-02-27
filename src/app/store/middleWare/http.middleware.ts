import { Injectable } from '@angular/core';
import { Http, Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';

import { IAppState } from '../state/AppState';
import { UiActions } from '../../common/ui-actions/ui-actions';
import { HttpRequest } from '../actions/action-types';

@Injectable()
export class HttpMiddleware {

  public invalidDataMessage = 'Data fetched is not valid';

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private http: Http,
    private uiActions: UiActions,
  ) {}

  public httpMiddlewareFactory() {
    const vm = this;
    return function httpMiddleware(store) {
      return (next) => (action) => {

        const request: HttpRequest = action.httpRequest;
        if (!request) {
          return next(action);
        }

        vm.uiActions.incrementLoading(action.type);
        vm.http.get(request.url).subscribe(
          (response) => {
            const data = response.json();
            const isValid = !request.validateResponse || request.validateResponse(data);
            if (isValid) {
              store.dispatch(request.successAction(data));
            } else {
              store.dispatch(request.failedAction(new Error(vm.invalidDataMessage)));
            }
          },
          (error) => {
            vm.uiActions.decrementLoading(action.type);
            store.dispatch(request.failedAction(error));
            if (error.status === 404 && request.four0FourMessage) {
              vm.uiActions.setFour0FourMessage(`Action type: ${action.type}`, request.four0FourMessage, request.url);
            }
          },
          (/*complete*/) => {
            vm.uiActions.decrementLoading(action.type);
          }
        );
      };
    };
  }

}
