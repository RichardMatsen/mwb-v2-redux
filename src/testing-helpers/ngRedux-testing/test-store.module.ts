import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';
import { select as selectDecorator, Selector, Comparator } from '@angular-redux/store';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { reduxLogger, createLogger } from 'redux-logger';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { IAppState, appInitialState } from 'app/store/state/AppState';
import { rootReducer } from 'app/store/reducers/root.reducer';

import { ValidationsActions } from 'app/store/actions/validations.actions';
import { ReferentialsActions } from 'app/store/actions/referentials.actions';
import { ClinicsActions } from 'app/store/actions/clinics.actions';
import { MeasureActions } from 'app/store/actions/measure.actions';
import { UiActions } from 'app/store/actions/ui.actions';
import { UserActions } from 'app/store/actions/user.actions';
import { ConfigActions } from 'app/store/actions/config.actions';
import { SearchActions } from 'app/store/actions/search.actions';
import { FileActions } from 'app/store/actions/file.actions';

import { freezeState } from 'app/store/middleware/freeze-state';
import { HttpMiddleware } from 'app/store/middleware/http.middleware';
import { UiMiddleware } from 'app/store/middleware/ui.middleware';
import { MigrationWorkBenchCommonModule } from 'app/common/mw.common.module';
import { Computed } from 'app/store/computed/computed-properties';
import { Actions } from 'app/store/actions/actions';
import { StoreService } from 'app/store/store.service';
import 'app/store/selector-helpers/selector-helpers';

@NgModule({
  imports: [
    NgReduxTestingModule,
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
    StoreService,
  ],
})
export class TestStoreModule {

  constructor(
    public ngRedux: MockNgRedux<IAppState>,
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
      );

    this.ngRedux.configureStore(
      rootReducer,
      appInitialState,
      [...middleware],
    );
  }
}
