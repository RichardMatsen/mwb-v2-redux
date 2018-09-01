import { Action, Reducer } from 'redux';

import { IAppState, appInitialState } from '../state/AppState';

import { measureReducer } from './measure.reducer';
import { pageReducer } from './page.reducer';
import { configReducer } from './config.reducer';
import { searchReducer } from './search.reducer';
import { userReducer } from './user.reducer';
import { uiReducer } from './ui.reducer';
import { fileReducer } from './file.reducer';

export const rootReducer = (state: IAppState = appInitialState, action) => Object.assign({}, state, {
  config: configReducer(state.config, action),
  measures: measureReducer(state.measures, action),
  pages: pageReducer(state.pages, action),
  search: searchReducer(state.search, action),
  ui: uiReducer(state.ui, action),
  user: userReducer(state.user, action),
  file: fileReducer(state.file, action)
});
