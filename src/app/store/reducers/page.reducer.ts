import { Action, Reducer } from 'redux';
import { GenericReducerFactory } from './generic.reducer';
import { PageState, PageStateRoot, pagesInitialState } from '../state/page.state';
import { PageActions } from 'app/store/actions/page.actions';

const factory = new GenericReducerFactory();

export const pageReducer: Reducer<PageStateRoot>  = factory.createReducer({
  initialState: pagesInitialState,
  handledActions: PageActions.ACTIONS,
  actionQualifierConfig: (action) => `[PAGE] ${action.type} / ${action.subState}`
});
