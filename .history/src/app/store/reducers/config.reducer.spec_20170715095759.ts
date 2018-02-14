import { Action } from 'redux';
import { configReducer } from './config.reducer';
import { ConfigActions } from '../../services/config/config.actions';
import { appInitialState } from '../state/AppState';
import { toHavePropertiesMatcher } from 'testing-helpers/jasmine-matchers/to-have-properties.matcher';
import { runReducerTests } from './generic.reducer.testing.helpers';

describe('configReducer', () => {

  const mockNgReduxDispatcher = jasmine.createSpyObj('mockNgRedux', ['dispatch', 'getState']);
  const mockObjectShapeComparer = jasmine.createSpyObj('mockObjectShapeComparer', ['compare']);
  const actions = new ConfigActions(mockNgReduxDispatcher, mockObjectShapeComparer);

  describe('Actions requiring empty state', () => {
    const testState = {...appInitialState.config};
    const action = actions.createInitializeConfigRequest();
    runReducerTests(testState, configReducer, action);
  });

});
