import { Action } from 'redux';
import { IUser } from '../../model/user.model';
import { userReducer } from './user.reducer';
import { UserActions } from '../../user/user.actions';
import { userInitialState } from '../state/user.state';
import { toHavePropertiesMatcher } from 'testing-helpers/jasmine-matchers/to-have-properties.matcher';
import { runReducerTests } from './generic.reducer.testing.hlpr';
import { HttpMiddleware } from '../middleware/http.middleware';

describe('userReducer', () => {

  const mockNgReduxDispatcher = jasmine.createSpyObj('mockNgRedux', ['dispatch', 'getState']);
  const mockHttp = jasmine.createSpyObj('mockHttp', ['get']);
  const mockUiActions = jasmine.createSpyObj('mockUiActions', ['incrementLoading', 'decrementLoading']);
  const httpMiddleware = new HttpMiddleware(mockNgReduxDispatcher, mockHttp, mockUiActions);

  const actions = new UserActions(mockNgReduxDispatcher);
  const testUser = {
    id: 1,
    firstName: 'Abe',
    lastName: 'Able',
    userName: 'Abab',
    lastActionTime: new Date()
  };

  describe('Actions requiring empty state', () => {
    const testState = {...userInitialState};
    [
      actions.createInitializeUsersRequest(),
      actions.createSetCurrentUser(testUser),
    ]
    .forEach(action => {
      runReducerTests(testState, userReducer, action, userInitialState.users);
    });
  });

  describe('Action tests requiring dynamic state (via mock)', () => {
    const testState = { currentUser: testUser };
    const mockState = {
      user: {
        currentUser: testUser,
        users: []
      }
    };
    mockNgReduxDispatcher.getState.and.returnValue(mockState);
    const action = actions.createUpdateCurrentUser('Beth', 'Bethal');
    runReducerTests(testState, userReducer, action);
  });

  describe('createInitialUsersSuccess', () => {

    it('should create a success action', () => {
      const users = [
        {id: 1, firstName: 'John', lastName: 'Jones', userName: 'JJ'},
        {id: 2, firstName: 'Debbie', lastName: 'Dear', userName: 'DD'},
      ];
      const response = users;
      const action = actions.createInitializeUsersSuccess(response);
      expect(action).toEqual({ type: 'INITIALIZE_USERS_SUCCESS', payload: { users  } });
    });

    it('should add response to state', () => {
      const testState = {...userInitialState};
      expect(testState).toEqual({ currentUser: null, users: null });
      const response = [testUser];
      const action = actions.createInitializeUsersSuccess(response);
      const newState = userReducer(testState, action);
      expect(newState).toEqual({ currentUser: null, users: [testUser] });
    });
  });

  describe('createInitialUsers.Failed', () => {

    const error = { status: 404, statusText: 'Not Found', url: 'http://localhost:4200/api/users' };

    it('should create a failed action', () => {
      const action = actions.createInitializeUsersFailed(error);
      expect(action).toEqual({ type: 'INITIALIZE_USERS_FAILED', payload: { error }});
    });

    it('should add error to state', () => {
      const testState = {...userInitialState};
      expect(testState).toEqual({ currentUser: null, users: null });
      const action = actions.createInitializeUsersFailed(error);
      const newState = userReducer(testState, action);
      expect(newState).toEqual({ currentUser: null, users: [], error });
    });
  });

});
