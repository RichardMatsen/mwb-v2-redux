import { Action } from 'redux';
import { searchReducer } from './search.reducer';
import { SearchActions } from '../../linqpad-review-pages/common/search/search.actions';
import { searchInitialState } from '../state/search.state';
import { toHavePropertiesMatcher } from 'testing-helpers/jasmine-matchers/to-have-properties.matcher';
import { runReducerTests } from './generic.reducer.testing.helpers';

describe('searchReducer', () => {

  const mockNgReduxDispatcher = jasmine.createSpyObj('mockNgRedux', ['dispatch', 'getState']);
  const actions = new SearchActions(mockNgReduxDispatcher);

  describe('Actions requiring empty state', () => {
    const testState = {...searchInitialState};
    [
      actions.createSetPage('aPage', true),
      actions.createSetSearchTerm('searchForThis'),
      actions.createSetResultsSuccess(['result1', 'result2']),
      actions.createSetResultsFailed(),
    ]
    .forEach(action => {
      runReducerTests(testState, searchReducer, action);
    });
  });

  describe('Action tests requiring static state', () => {
    const testState = { page: 'aPage', pageIsSearchable: true, searchTerm: 'searchForThis', results: ['result1', 'result2']};
    const action = actions.createResetResults();
    runReducerTests(testState, searchReducer, action);
  });

});
