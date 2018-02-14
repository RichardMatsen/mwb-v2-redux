import { Action } from 'redux';
import { IFileInfo } from '../../model/fileinfo.model';
import { pageReducer } from './page.reducer';
import { PageActions } from '../../linqpad-review-pages/common/page.actions';
import { PageActionType } from '../state/action-types';
import { pagesInitialState } from '../state/page.state';
import { runReducerTests } from './generic.reducer.testing.hlpr';

// Make concrete class to test abstract class
class TestPageActions extends PageActions {
  public PAGE = 'validations';
}

describe('pageReducer', () => {

  const files: IFileInfo[] = [{name: 'file1', effectiveDate: new Date()}, {name: 'file2', effectiveDate: new Date()}];
  const mockNgReduxDispatcher = jasmine.createSpyObj('mockNgRedux', ['dispatch', 'getState']);
  const pageActions = new TestPageActions(mockNgReduxDispatcher);

  describe('Actions requiring empty state', () => {
    const testState = {...pagesInitialState};
    [
      pageActions.createInitializeListRequest(),
      pageActions.createInitializeListSuccess(files, 1),
      pageActions.createInitializeListFailed(new Error('an error')),
      pageActions.createUpdateListRequest(),
      pageActions.createUpdateListFailed('error occurred'),
      pageActions.createChangeFile(files[1]),
      pageActions.createRefresh(files[0]),
      pageActions.createSetLastRefresh(),
    ]
    .forEach(action => {
      runReducerTests(testState, pageReducer, action);
    });
  });

  describe('Action tests requiring static state', () => {
    const testState = {...pagesInitialState};
    testState.validations.files = files;
    const newFiles: IFileInfo[] = [{name: 'file3', effectiveDate: new Date()}, {name: 'file4', effectiveDate: new Date()}];
    const action = pageActions.createUpdateListSuccess(newFiles, 1);
    runReducerTests(testState, pageReducer, action);
  });

  describe('Action tests requiring dynamic state (via mock)', () => {
    const testState = {...pagesInitialState};
    const mockState = {
      pages: {
        validations: {files: files},
        referentials: {},
        clinics: {},
      }
    };
    mockNgReduxDispatcher.getState.and.returnValue(mockState);
    const action = pageActions.createSetNumToDisplay(1);
    runReducerTests(testState, pageReducer, action);
  });

});
