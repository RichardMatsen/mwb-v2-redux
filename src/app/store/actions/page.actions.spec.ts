import { PageActions } from './page.actions';
import { mockFactory } from 'testing-helpers/testing-helpers.module.hlpr';

class TestPageActions extends PageActions {
  public PAGE = 'validations';
}

describe('PageActions', () => {

  const mockNgRedux = jasmine.createSpyObj('mockNgRedux', ['dispatch', 'getState']);
  mockNgRedux.getState.and.returnValue({ pages: { validations: { files: [] }}} );

  const pageActions = new TestPageActions(mockNgRedux);

  beforeEach( () => {
    mockNgRedux.dispatch.calls.reset();
  });

  it('should dispatch INITIALIZE_FILES_REQUEST', () => {
    pageActions.initializeListRequest();
    expect(mockNgRedux.dispatch).toHaveBeenCalled();
  });

  it('should dispatch INITIALIZE_FILES_SUCCESS', () => {
    pageActions.initializeListSuccess([], 0);
    expect(mockNgRedux.dispatch).toHaveBeenCalled();
  });

  it('should dispatch INITIALIZE_FILES_FAILED', () => {
    pageActions.initializeListFailed(new Error());
    expect(mockNgRedux.dispatch).toHaveBeenCalled();
  });

  it('should dispatch UPDATE_FILES_REQUEST', () => {
    pageActions.updateListRequest();
    expect(mockNgRedux.dispatch).toHaveBeenCalled();
  });

  it('should dispatch UPDATE_FILES_SUCCESS', () => {
    pageActions.updateListSuccess([], 0);
    expect(mockNgRedux.dispatch).toHaveBeenCalled();
  });

  it('should dispatch UPDATE_FILES_FAILED', () => {
    pageActions.updateListFailed(new Error());
    expect(mockNgRedux.dispatch).toHaveBeenCalled();
  });

  it('should dispatch SET_NUM_VISIBLE', () => {
    pageActions.setNumToDisplay(0);
    expect(mockNgRedux.dispatch).toHaveBeenCalled();
  });

  it('should dispatch CHANGE_FILE', () => {
    pageActions.changeFile({name: null, effectiveDate: null});
    expect(mockNgRedux.dispatch).toHaveBeenCalled();
  });

  it('should dispatch RELOAD_FILE', () => {
    pageActions.refresh({name: null, effectiveDate: null});
    expect(mockNgRedux.dispatch).toHaveBeenCalled();
  });

  it('should dispatch SET_LAST_REFRESH', () => {
    pageActions.setLastRefresh();
    expect(mockNgRedux.dispatch).toHaveBeenCalled();
  });

});
