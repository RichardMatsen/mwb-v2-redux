// REF: https://github.com/angular-redux/example-app/blob/master/src/app/store/store.module.ts

import { NgModule } from '@angular/core';
import { NgReduxModule, NgRedux, DevToolsExtension } from '@angular-redux/store';
import { applyMiddleware, Store, combineReducers, compose, createStore } from 'redux';
import { reduxLogger, createLogger } from 'redux-logger';

import { environment } from '../../environments/environment';
import { IAppState, appInitialState } from './state/AppState';
import { rootReducer } from './reducers/root.reducer';
import { ValidationsActions } from '../linqpad-review-pages/validations/services/validations.actions';
import { ReferentialsActions } from '../linqpad-review-pages/referentials/services/referentials.actions';
import { ClinicsActions } from '../linqpad-review-pages/clinics/services/clinics.actions';
import { freezeState } from './middleware/freeze-state';
import { HttpMiddleware } from './middleware/http.middleware';
import { UiMiddleware } from './middleware/ui.middleware';
import { UiActions } from '../common/ui-actions/ui-actions';

@NgModule({
  imports: [ NgReduxModule ],
  providers: [
    ValidationsActions,
    ReferentialsActions,
    ClinicsActions,
    HttpMiddleware,
    UiMiddleware,
  ],
})
export class StoreModule {

  constructor(
    public ngRedux: NgRedux<IAppState>,
    private devTools: DevToolsExtension,
    private httpMiddleware: HttpMiddleware,
    private uiMiddleware: UiMiddleware,
  ) {
    this.buildStore();
  }

  buildStore() {

    const includeActions = (getState, action) => !action.excludeFromLog;

    const logger = createLogger({
      predicate: includeActions
    });

    const middleware =
      (environment.production ? [] : [freezeState])
      .concat(
        this.httpMiddleware.httpMiddlewareFactory(),
        this.uiMiddleware.uiMiddlewareFactory(),
        // logger
      );

      this.ngRedux.configureStore(
      rootReducer,
      appInitialState,
      [...middleware],
      this.devTools.isEnabled() ? [ this.devTools.enhancer({ predicate: includeActions }) ] : []
    );
  }
}
