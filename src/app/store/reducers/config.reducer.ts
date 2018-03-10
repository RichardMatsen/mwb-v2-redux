import { Action, Reducer } from 'redux';
import { GenericReducerFactory } from './generic.reducer';
import { ConfigActions } from '../../services/config/config.actions';

const factory = new GenericReducerFactory();

export const configReducer: Reducer<any> = factory.createReducer({
  initialState: {},
  handledActions: ConfigActions.ACTIONS,
  actionQualifierConfig: 'CONFIG'
});
