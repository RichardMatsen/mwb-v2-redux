import { Action } from 'redux';
import { IFileInfo } from '../../model/fileinfo.model';
import { pageReducer } from './page.reducer';
import { PageActions } from '../../linqpad-review-pages/common/page.actions';
import { IAppState, appInitialState } from '../state/AppState';
import { formatAMPM } from '../../common/mw.common.module';
import { toHavePropertiesMatcher } from 'testing-helpers/jasmine-matchers/to-have-properties.matcher';

class TestPageActions extends PageActions {
  public PAGE = 'testPage';
}

describe('pageReducer', () => {

  const files: IFileInfo[] = [{name: 'file1', effectiveDate: new Date()}, {name: 'file2', effectiveDate: new Date()}];
  const mockNgReduxDispatcher = jasmine.createSpyObj('mockNgRedux', ['dispatch']);
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
      expect(action.type).toEqual('[PAGE] INITIALIZE_FILES_REQUEST / testPage');
      expect(testState.pages).toBe(testState.pages);
    });
  });

  function checkFileSuccessMethod(actionForTest) {

    let action;
    beforeEach( () => {
      action = Object.assign({}, actionForTest);
    });

    it('should set files list', () => {
      testState.pages = pageReducer(testState.pages, action);
      expect(testState.pages.testPage.files).toEqual(files);
    });

    it('should set fileInfo to first in list if null', () => {
      testState.pages.testPage.fileInfo = null;
      testState.pages = pageReducer(testState.pages, action);
      expect(testState.pages.testPage.fileInfo).toEqual(files[0]);
    });

    it('should not set fileInfo if not null', () => {
      testState.pages.testPage.fileInfo = 'not null';
      testState.pages = pageReducer(testState.pages, action);
      expect(testState.pages.testPage.fileInfo).toEqual('not null');
    });

    it('should set numVisible', () => {
      testState.pages = pageReducer(testState.pages, action);
      expect(testState.pages.testPage.numVisible).toEqual(1);
    });

    it('should set visibleFiles', () => {
      testState.pages = pageReducer(testState.pages, action);
      expect(testState.pages.testPage.visibleFiles).toEqual(['file1']);
    });

    it('should set lastRefresh', () => {
      expect(testState.pages.validations.lastRefresh).toBeFalsy();
      testState.pages = pageReducer(testState.pages, action);
      // console.log(testState.pages.testPage);
      expect(testState.pages.testPage.lastRefresh).toBeTruthy();
    });
  }

  describe('PageActions.INITIALIZE_FILES_SUCCESS', () => {
    const action = pageActions.createInitializeListSuccess(files, 1);
    checkFileSuccessMethod(action);
  });

  describe('PageActions.INITIALIZE_FILES_FAIL', () => {
    it('should set page.error', () => {
      const action = pageActions.createInitializeListFailed(new Error('error occurred'));
      testState.pages = pageReducer(testState.pages, action);
      expect(testState.pages.testPage.error).toEqual('error occurred');
    });
  });

  describe('PageActions.UPDATE_FILES', () => {
    it('should qualify action.type but not change state', () => {
      const action = pageActions.createUpdateListRequest();
      pageReducer(testState.pages, action);
      expect(action.type).toEqual('[PAGE] UPDATE_FILES / testPage');
      expect(testState.pages).toBe(testState.pages);
    });
  });

  describe('PageActions.UPDATE_FILES_SUCCESS', () => {
    it('should set the payload', () => {
      const action = pageActions.createUpdateListSuccess(files, 1);
      checkFileSuccessMethod(action);
    });
  });

  describe('PageActions.UPDATE_FILES_FAIL', () => {
    it('should set page.error', () => {
      const action = pageActions.createUpdateListFailed('error occurred');
      testState.pages = pageReducer(testState.pages, action);
      expect(testState.pages.testPage.error).toEqual('error occurred');
    });
  });

  describe('PageActions.SET_NUM_VISIBLE', () => {

    it('should set numVisible', () => {
      const action = pageActions.createSetNumToDisplay(1);
      testState.pages.validations.files = files;
      testState.pages = pageReducer(testState.pages, action);
      expect(testState.pages.testPage.numVisible).toEqual(1);
    });

    it('should set visibleFiles', () => {
      const action = pageActions.createSetNumToDisplay(1);
      testState.pages.validations.files = files;
      testState.pages = pageReducer(testState.pages, action);
      expect(testState.pages.testPage.visibleFiles).toEqual(['file1']);
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
      expect(testState.pages.testPage.fileInfo.name).toEqual(action.payload.fileInfo.name);
      expect(testState.pages.testPage.fileInfo).not.toBe(fileInfo1);
    });

  }

  describe('PageActions.CHANGE_FILE', () => {
    const action = {type: PageActions.CHANGE_FILE, page: 'validations',
      payload: { fileInfo: {name: 'fileInfo2'} } };
    test_SetCurrentFile(action);
  });

  describe('PageActions.RELOAD_FILE', () => {
    const action = {type: PageActions.RELOAD_FILE, page: 'validations',
      payload: { fileInfo: {name: 'fileInfo1'} }};
    test_SetCurrentFile(action);
  });

});
