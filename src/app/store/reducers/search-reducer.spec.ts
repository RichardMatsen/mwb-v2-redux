import { Action } from 'redux';
import { searchReducer } from './search.reducer';
import { SearchActions } from '../../linqpad-review-pages/common/search/search.actions';
import { searchInitialState } from '../state/search.state';
import { toHavePropertiesMatcher } from 'testing-helpers/jasmine-matchers/to-have-properties.matcher';
import { runAllReducerTests, ReducerTestConfig } from './generic.reducer.testing.hlpr';

describe('searchReducer', () => {

  const mockNgReduxDispatcher = jasmine.createSpyObj('mockNgRedux', ['dispatch', 'getState']);
  const actions = new SearchActions(mockNgReduxDispatcher);

  const stateForResetTest = { page: 'aPage', pageIsSearchable: true, searchTerm: 'searchForThis', results: ['result1', 'result2']};
  const tests: ReducerTestConfig[] = [
    {
      action: actions.createSetPage('aPage', true),
      stateForReducer: searchInitialState
    },
    {
      action: actions.createSetSearchTerm('searchForThis'),
      stateForReducer: searchInitialState
    },
    {
      action: actions.createSetResultsSuccess(['result1', 'result2']),
      stateForReducer: searchInitialState
    },
    {
      action: actions.createSetResultsFailed(),
      stateForReducer: searchInitialState
    },
    {
      action: actions.createResetResults(),
      stateForReducer: stateForResetTest
    }
  ];

  runAllReducerTests(searchReducer, tests);

});
