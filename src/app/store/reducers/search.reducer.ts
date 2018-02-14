import { Action, Reducer } from 'redux';
import { GenericReducerFactory } from './generic.reducer';
import { SearchState, searchInitialState } from '../state/search.state';
import { SearchActions } from '../../linqpad-review-pages/common/search/search.actions';

const factory = new GenericReducerFactory();
export const searchReducer: Reducer<SearchState> = factory.createReducer({
  initialState: searchInitialState,
  handledActions: SearchActions.ACTIONS,
  actionQualifierConfig: 'SEARCH'
});
