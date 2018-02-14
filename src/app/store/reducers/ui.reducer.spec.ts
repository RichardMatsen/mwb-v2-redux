import { Action } from 'redux';
import { uiReducer } from './ui.reducer';
import { UiActions } from '../../common/ui-actions/ui-actions';
import { IAppState, appInitialState } from '../state/AppState';

describe('UiReducer', () => {

  const mockNgReduxDispatcher = jasmine.createSpyObj('mockNgRedux', ['dispatch', 'getState']);
  const uiActions = new UiActions(mockNgReduxDispatcher);

  let testState;
  beforeEach(() => {
    testState = Object.assign({}, appInitialState);
  });

  describe('UiActions.INCREMENT_LOADING', () => {

    it('should increment activeRequests', () => {
      expect(testState.ui.activeRequests).toEqual(0);

      const action1 = {type: UiActions.INCREMENT_LOADING, trigger: 'Testing'};
      testState.ui = uiReducer(testState.ui, action1);
      expect(testState.ui.activeRequests).toEqual(1);

      const action2 = {type: UiActions.INCREMENT_LOADING, trigger: 'Testing'};
      testState.ui = uiReducer(testState.ui, action2);
      expect(testState.ui.activeRequests).toEqual(2);
    });
  });

  describe('UiActions.DECREMENT_LOADING', () => {

    it('should decrement activeRequests', () => {
      testState.ui.activeRequests = 2;
      const action = {type: UiActions.DECREMENT_LOADING, trigger: 'Testing'};

      testState.ui = uiReducer(testState.ui, action);
      expect(testState.ui.activeRequests).toEqual(1);
    });

    it('should not decrement activeRequests below zero', () => {
      testState.ui.activeRequests = 1;
      const action = {type: UiActions.DECREMENT_LOADING, trigger: 'Testing'};

      testState.ui = uiReducer(testState.ui, action);
      testState.ui = uiReducer(testState.ui, action);
      expect(testState.ui.activeRequests).not.toEqual(-1);
    });
  });

  describe('UiActions.FOUR0FOUR_MESSAGE', () => {
    it('should set the message on state', () => {
      const caller = 'caller1';
      const message = 'some message';
      const url = 'some url';
      const methodArgs = 'this and that';
      const action = uiActions.createSetFour0FourMessage(caller, message, url, methodArgs);

      testState.ui = uiReducer(testState.ui, action);
      expect(testState.ui.four0four.caller).toEqual('caller1');
      expect(testState.ui.four0four.message).toEqual('some message');
      expect(testState.ui.four0four.url).toEqual('some url');
      expect(testState.ui.four0four.methodArgs).toEqual('this and that');
    });
  });

});
