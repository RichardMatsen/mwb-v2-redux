import { Action } from 'redux';
import { IUser } from 'app/model/user.model';
import { userReducer } from './user.reducer';
import { UserActions } from 'app/store/actions/user.actions';
import { userInitialState } from '../state/user.state';
import { toHavePropertiesMatcher } from 'testing-helpers/jasmine-matchers/to-have-properties.matcher';
import { HttpMiddleware } from '../middleware/http.middleware';
import { runAllReducerTests, ReducerTestConfig } from './generic.reducer.testing.hlpr';

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

  const updateCurrentUserState = { currentUser: testUser };
  const mockState = {
    user: {
      currentUser: testUser,
      users: []
    }
  };
  mockNgReduxDispatcher.getState.and.returnValue(mockState);

  const users = [
    {id: 1, firstName: 'John', lastName: 'Jones', userName: 'JJ'},
    {id: 2, firstName: 'Debbie', lastName: 'Dear', userName: 'DD'},
  ];

  const error = { status: 404, statusText: 'Not Found', url: 'http://localhost:4200/api/users' };

  const tests: ReducerTestConfig[] = [
    {
      action: actions.createInitializeUsersRequest(),
      stateForReducer: userInitialState
    },
    {
      action: actions.createInitializeUsersSuccess(users),
      stateForReducer: userInitialState
    },
    {
      action: actions.createInitializeUsersFailed(error),
      stateForReducer: userInitialState
    },
    {
      action: actions.createSetCurrentUser(testUser),
      stateForReducer: userInitialState
    },
    {
      action: actions.createUpdateCurrentUser('Beth', 'Bethal'),
      stateForReducer: updateCurrentUserState
    },
  ];

  runAllReducerTests(userReducer, tests);

});
