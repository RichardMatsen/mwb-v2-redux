import { SearchActions } from './search.actions';

describe('SearchActions', () => {

  const mockNgRedux = jasmine.createSpyObj('mockNgRedux', ['dispatch', 'getState']);
  mockNgRedux.getState.and.returnValue({ pages: { validations: { files: [] }}} );

  const searchActions = new SearchActions(mockNgRedux);

  beforeEach( () => {
    mockNgRedux.dispatch.calls.reset();
  });

  it('should dispatch RESET_RESULTS', () => {
    searchActions.resetResults();
    expect(mockNgRedux.dispatch).toHaveBeenCalled();
  });

  it('should dispatch SET_PAGE', () => {
    searchActions.setPage('aPage', true);
    expect(mockNgRedux.dispatch).toHaveBeenCalled();
  });

  it('should dispatch SET_SEARCHTERM', () => {
    searchActions.setSearchTerm('search term');
    expect(mockNgRedux.dispatch).toHaveBeenCalled();
  });

  it('should dispatch SET_RESULTS_SUCCESS', () => {
    searchActions.setResultsSuccess([]);
    expect(mockNgRedux.dispatch).toHaveBeenCalled();
  });

  it('should dispatch SET_RESULTS_FAIL', () => {
    searchActions.setResultsFailed();
    expect(mockNgRedux.dispatch).toHaveBeenCalled();
  });

});
