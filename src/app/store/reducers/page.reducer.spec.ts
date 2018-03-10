import { Action } from 'redux';
import { IFileInfo } from '../../model/fileinfo.model';
import { pageReducer } from './page.reducer';
import { PageActions } from '../../linqpad-review-pages/common/page.actions';
import { PageActionType } from '../actions/pageActionType';
import { pagesInitialState } from '../state/page.state';
import { runAllReducerTests, runReducerTests, ReducerTestConfig } from './generic.reducer.testing.hlpr';

// Make concrete class to test abstract class
class TestPageActions extends PageActions {
  public PAGE = 'validations';
}

describe('pageReducer', () => {

  const files: IFileInfo[] = [{name: 'file1', effectiveDate: new Date()}, {name: 'file2', effectiveDate: new Date()}];
  const mockNgRedux = jasmine.createSpyObj('mockNgRedux', ['dispatch', 'getState']);
  const actions = new TestPageActions(mockNgRedux);

  const updateListState = {...pagesInitialState};
  updateListState.validations.files = files;
  const newFiles: IFileInfo[] = [{name: 'file3', effectiveDate: new Date()}, {name: 'file4', effectiveDate: new Date()}];

  const tests: ReducerTestConfig[] = [
    {
      action: actions.createInitializeListRequest(),
      stateForReducer: pagesInitialState
    },
    {
      action: actions.createInitializeListSuccess(files, 1),
      stateForReducer: pagesInitialState
    },
    {
      action: actions.createInitializeListFailed(new Error('an error')),
      stateForReducer: pagesInitialState
    },
    {
      action: actions.createUpdateListRequest(),
      stateForReducer: pagesInitialState
    },
    {
      action: actions.createUpdateListFailed('error occurred'),
      stateForReducer: pagesInitialState
    },
    {
      action: actions.createChangeFile(files[1]),
      stateForReducer: pagesInitialState
    },
    {
      action: actions.createRefresh(files[0]),
      stateForReducer: pagesInitialState
    },
    {
      action: actions.createSetLastRefresh(),
      stateForReducer: pagesInitialState
    },
    {
      action: actions.createUpdateListSuccess(newFiles, 1),
      stateForReducer: updateListState
    },
  ];
  runAllReducerTests(pageReducer, tests);

  /*
    Action SET_NUM_VISIBLE uses existing state to get a list of files
    Use mock state to simulate the file list
  */
  const stateForSetNumToDisplay = {
    pages: {
      validations: {files: files},
      referentials: {},
      clinics: {},
    }
  };
  mockNgRedux.getState.and.returnValue(stateForSetNumToDisplay);
  runReducerTests(pagesInitialState, pageReducer, actions.createSetNumToDisplay(1));

});
