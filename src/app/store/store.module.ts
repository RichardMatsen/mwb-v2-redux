// REF: https://github.com/angular-redux/example-app/blob/master/src/app/store/store.module.ts

import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { NgReduxModule, NgRedux, DevToolsExtension } from '@angular-redux/store';
import { select as selectDecorator, Selector, Comparator } from '@angular-redux/store';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { reduxLogger, createLogger } from 'redux-logger';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { IAppState, appInitialState } from './state/AppState';
import { rootReducer } from './reducers/root.reducer';

import { ValidationsActions } from 'app/store/actions/validations.actions';
import { ReferentialsActions } from 'app/store/actions/referentials.actions';
import { ClinicsActions } from 'app/store/actions/clinics.actions';
import { MeasureActions } from 'app/store/actions/measure.actions';
import { UiActions } from 'app/store/actions/ui.actions';
import { UserActions } from 'app/store/actions/user.actions';
import { ConfigActions } from 'app/store/actions/config.actions';
import { SearchActions } from 'app/store/actions/search.actions';
import { FileActions } from 'app/store/actions/file.actions';

import { freezeState } from './middleware/freeze-state';
import { HttpMiddleware } from './middleware/http.middleware';
import { UiMiddleware } from './middleware/ui.middleware';
import { MigrationWorkBenchCommonModule } from 'app/common/mw.common.module';
import { Computed } from './computed/computed-properties';
import { Actions } from './actions/actions';
import { StoreService } from './store.service';
import './selector-helpers/selector-helpers';

@NgModule({
  imports: [
    NgReduxModule,
    HttpModule,
    MigrationWorkBenchCommonModule
  ],
  providers: [
    ValidationsActions,
    ReferentialsActions,
    ClinicsActions,
    MeasureActions,
    UiActions,
    UserActions,
    ConfigActions,
    SearchActions,
    FileActions,
    HttpMiddleware,
    UiMiddleware,
    Actions,
    Computed,
    StoreService
  ],
})
export class StoreModule {

  constructor(
    public ngRedux: NgRedux<IAppState>,
    private devTools: DevToolsExtension,
    private httpMiddleware: HttpMiddleware,
    private uiMiddleware: UiMiddleware,
    private actions: Actions,
    private computed: Computed
  ) {
    this.buildStore();
  }

  buildStore() {

    const includeActions = (getState, action) => !action.excludeFromLog;

    const logger = createLogger({
      predicate: includeActions
    });

    const middleware =
      (environment && environment.production ? [] : [freezeState])
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
