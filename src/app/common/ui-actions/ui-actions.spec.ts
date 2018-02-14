import { UiActions } from './ui-actions';

describe('UiActions', () => {

  const mockNgRedux = jasmine.createSpyObj('mockNgRedux', ['dispatch', 'getState']);
  // mockNgRedux.getState.and.returnValue({ user: { currentUser: { id: 1, firstName: 'John', lastName: 'Jones', userName: 'JJones' }}} );

  const uiActions = new UiActions(mockNgRedux);

  beforeEach( () => {
    mockNgRedux.dispatch.calls.reset();
  });

  it('should dispatch INCREMENT_LOADING', () => {
    uiActions.incrementLoading('a trigger');
    expect(mockNgRedux.dispatch).toHaveBeenCalled();
  });

  it('should dispatch DECREMENT_LOADING', () => {
    uiActions.decrementLoading('a trigger');
    expect(mockNgRedux.dispatch).toHaveBeenCalled();
  });

  it('should dispatch FOUR0FOUR_MESSAGE', () => {
    uiActions.setFour0FourMessage('caller', 'message', 'url', 'methodArgs');
    expect(mockNgRedux.dispatch).toHaveBeenCalled();
  });

});
