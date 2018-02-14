import { UserActions } from './user.actions';

describe('UserActions', () => {

  const mockNgRedux = jasmine.createSpyObj('mockNgRedux', ['dispatch', 'getState']);
  mockNgRedux.getState.and.returnValue({ user: { currentUser: { id: 1, firstName: 'John', lastName: 'Jones', userName: 'JJones' }}} );

  const userActions = new UserActions(mockNgRedux);

  beforeEach( () => {
    mockNgRedux.dispatch.calls.reset();
  });

  it('should dispatch INITIALIZE_USERS_REQUEST', () => {
    userActions.initializeUsersRequest();
    expect(mockNgRedux.dispatch).toHaveBeenCalled();
  });

  it('should dispatch INITIALIZE_USERS_SUCCESS', () => {
    userActions.initializeUsersSuccess(users);
    expect(mockNgRedux.dispatch).toHaveBeenCalled();
  });

  it('should dispatch INITIALIZE_USERS_FAILED', () => {
    userActions.initializeUsersFailed(new Error());
    expect(mockNgRedux.dispatch).toHaveBeenCalled();
  });

  it('should dispatch SET_CURRENT_USER', () => {
    userActions.setCurrentUser({id: 1, firstName: 'John', lastName: 'Jones', userName: 'JJones'});
    expect(mockNgRedux.dispatch).toHaveBeenCalled();
  });

  it('should dispatch UPDATE_CURRENT_USER', () => {
    userActions.updateCurrentUser('Jim', 'Jones');
    expect(mockNgRedux.dispatch).toHaveBeenCalled();
  });

});
