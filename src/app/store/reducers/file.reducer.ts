import { Action, Reducer } from 'redux';
import { GenericReducerFactory } from './generic.reducer';
import { FileActions } from 'app/store/actions/file.actions';
import { FileState, fileInitialState } from 'app/store/state/file.state';

const factory = new GenericReducerFactory();

export const fileReducer: Reducer<any> = factory.createReducer({
  initialState: fileInitialState,
  handledActions: FileActions.ACTIONS,
  actionQualifierConfig: 'FILE'
});
