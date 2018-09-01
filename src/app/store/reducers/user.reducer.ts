import { Action, Reducer } from 'redux';
import { GenericReducerFactory } from './generic.reducer';
import { UserState, userInitialState } from '../state/user.state';
import { UserActions } from 'app/store/actions/user.actions';

const factory = new GenericReducerFactory();
export const userReducer: Reducer<UserState> = factory.createReducer({
  initialState: userInitialState,
  handledActions: UserActions.ACTIONS,
  actionQualifierConfig: 'USER'
});
