import { Action } from 'redux';
import { IFileInfo } from 'app/model/fileinfo.model';
import { pageReducer } from './page.reducer';
import { PageActions } from 'app/store/actions/page.actions';
import { IAppState, appInitialState } from '../state/AppState';
import { formatAMPM } from 'app/common/mw.common.module';
import { toHavePropertiesMatcher } from 'testing-helpers/jasmine-matchers/to-have-properties.matcher';

class TestPageActions extends PageActions {
  public PAGE = 'validations';
}

describe('pageReducer', () => {

  const files: IFileInfo[] = [{name: 'file1', effectiveDate: new Date()}, {name: 'file2', effectiveDate: new Date()}];
  const mockNgReduxDispatcher = jasmine.createSpyObj('mockNgRedux', ['dispatch', 'getState']);
  mockNgReduxDispatcher.getState.and.returnValue({
    pages: {
      validations: {
        files: files,
        fileInfo: null,
        numVisible: 0,
        visibleFiles: []
      }
    }
  });
  const pageActions = new TestPageActions(mockNgReduxDispatcher);

  let testState;
  beforeEach(() => {
    testState = Object.assign({}, appInitialState);
  });

  beforeEach( () => {
    jasmine.addMatchers(toHavePropertiesMatcher);
  });

  describe('PageActions.INITIALIZE_FILES', () => {
    it('should qualify action.type but not change state', () => {
      const action = pageActions.createInitializeListRequest();
      pageReducer(testState.pages, action);
      expect(action.type).toEqual('[PAGE] INITIALIZE_FILES_REQUEST / validations');
      expect(testState.pages).toBe(testState.pages);
    });
  });

  describe('PageActions.INITIALIZE_FILES_SUCCESS', () => {

    const actionForTest = pageActions.createInitializeListSuccess(files, 1);
    let action;
    beforeEach( () => {
      action = Object.assign({}, actionForTest);
    });

    it('should set files list', () => {
      testState.pages = pageReducer(testState.pages, action);
      expect(testState.pages.validations.files).toEqual(files);
    });

    it('should set fileInfo to first in list if null', () => {
      testState.pages.validations.fileInfo = null;
      testState.pages = pageReducer(testState.pages, action);
      expect(testState.pages.validations.fileInfo).toEqual(files[0]);
    });

    it('should set numVisible', () => {
      testState.pages = pageReducer(testState.pages, action);
      expect(testState.pages.validations.numVisible).toEqual(1);
    });

    it('should set lastRefresh', () => {
      expect(testState.pages.validations.lastRefresh).toBeFalsy();
      testState.pages = pageReducer(testState.pages, action);
      expect(testState.pages.validations.lastRefresh).toBeTruthy();
    });
  });

  describe('PageActions.INITIALIZE_FILES_FAIL', () => {
    it('should set page.error', () => {
      const action = pageActions.createInitializeListFailed(new Error('error occurred'));
      testState.pages = pageReducer(testState.pages, action);
      expect(testState.pages.validations.error).toEqual(new Error('error occurred'));
    });
  });

  describe('PageActions.UPDATE_FILES', () => {
    it('should qualify action.type but not change state', () => {
      const action = pageActions.createUpdateListRequest();
      pageReducer(testState.pages, action);
      expect(action.type).toEqual('[PAGE] UPDATE_FILES_REQUEST / validations');
      expect(testState.pages).toBe(testState.pages);
    });
  });

  describe('PageActions.UPDATE_FILES_SUCCESS', () => {

    const actionForTest = pageActions.createUpdateListSuccess(files, 1);
    let action;
    beforeEach( () => {
      action = Object.assign({}, actionForTest);
    });

    it('should set files list', () => {
      testState.pages = pageReducer(testState.pages, action);
      expect(testState.pages.validations.files).toEqual(files);
    });

    it('should set numVisible', () => {
      testState.pages = pageReducer(testState.pages, action);
      expect(testState.pages.validations.numVisible).toEqual(1);
    });

    it('should set lastRefresh', () => {
      expect(testState.pages.validations.lastRefresh).toBeFalsy();
      testState.pages = pageReducer(testState.pages, action);
      expect(testState.pages.validations.lastRefresh).toBeTruthy();
    });
  });

  describe('PageActions.UPDATE_FILES_FAIL', () => {
    it('should set page.error', () => {
      const action = pageActions.createUpdateListFailed('error occurred');
      testState.pages = pageReducer(testState.pages, action);
      expect(testState.pages.validations.error).toEqual('error occurred');
    });
  });

  describe('PageActions.SET_NUM_VISIBLE', () => {

    it('should set numVisible', () => {
      testState.pages.validations.files = files;
      const action = pageActions.createSetNumToDisplay(1);
      testState.pages = pageReducer(testState.pages, action);
      expect(testState.pages.validations.numVisible).toEqual(1);
    });

  });

  function test_SetCurrentFile(actionForTest) {

    let action;
    beforeEach( () => {
      action = Object.assign({}, actionForTest);
    });

    it('should change fileInfo', () => {
      const fileInfo1 = {name: 'fileInfo1'};
      testState.pages.validations.fileInfo = fileInfo1;
      testState.pages = pageReducer(testState.pages, action);
      expect(testState.pages.validations.fileInfo.name).toEqual(action.payload.fileInfo.name);
      expect(testState.pages.validations.fileInfo).not.toBe(fileInfo1);
    });

  }

  describe('PageActions.CHANGE_FILE', () => {
    const action = pageActions.createChangeFile(files[1]);
    test_SetCurrentFile(action);
  });

  describe('PageActions.RELOAD_FILE', () => {
    const clone = Object.assign({}, files[0]);
    const action = pageActions.createRefresh(clone);
    test_SetCurrentFile(action);
  });

});
