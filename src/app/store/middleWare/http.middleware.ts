import { Injectable } from '@angular/core';
import { Http, Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';

import { IAppState } from '../state/AppState';
import { UiActions } from '../../common/ui-actions/ui-actions';

/*
Problem running angular method outside the zone
Solved with a factory method and fat-arrow syntax which captures 'this' context, allowing http to be visible in the middleware.

error_handler.js:54 EXCEPTION: Uncaught (in promise): Error: Error in :0:0 caused by: Cannot read property 'httpRunner' of undefined
Error: Error in :0:0 caused by: Cannot read property 'httpRunner' of undefined
    at ViewWrappedError.ZoneAwareError (http://localhost:4200/vendor.bundle.js:122372:33)
*/

@Injectable()
export class HttpMiddleware {

  public invalidDataMessage = 'Data fetched is not valid';

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private http: Http,
    private uiActions: UiActions,
  ) {}

  public httpMiddlewareFactory() {
    return (store) => (next) => (action) => {

      if (!action.httpRequest) {
        return next(action);
      }

      this.uiActions.incrementLoading(action.type);
      this.http.get(action.httpRequest.url).subscribe(
        (response) => {
          const data = response.json();
          const isValid = !action.httpRequest.validateResponse || action.httpRequest.validateResponse(data);
          if (isValid) {
            store.dispatch(action.httpRequest.successAction(data));
          } else {
            store.dispatch(action.httpRequest.failedAction(new Error(this.invalidDataMessage)));
          }
        },
        (error) => {
          this.uiActions.decrementLoading(action.type);
          store.dispatch(action.httpRequest.failedAction(error));
       },
        (/*complete*/) => {
          this.uiActions.decrementLoading(action.type);
        }
      );
    };
  };

}
