import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';
import { NameParsingService } from '../../app/services/data-service/name-parsing.service';

export const setupMockFormatService = () => {
  let mockFormatService;
  mockFormatService = jasmine.createSpyObj('mockFormatService', ['processContent', 'getBadgeColor', 'getCount']);
  mockFormatService.processContent.and.callFake(function(content, file) {
    file.content = content;
    return file;
  });
  return mockFormatService;
};

export const setupMockFileService = () => {
  let mockFileService;
  const filePrefixes: string[] = ['file'];
  const nameParsingService = new NameParsingService();
  mockFileService = jasmine.createSpyObj('mockFileService', ['getFileList', 'getFile']);
  mockFileService.getFile.and.callFake(function(url) {
    return Observable.of( new Response());
  });
  return mockFileService;
};

let resultFiles, numToDisplay;

export const setupMockPageActions = () => {
  const mockPageActions = jasmine.createSpyObj('mockPageActions',
    ['initializeListRequest', 'initializeListSuccess', 'initializeListFailed',
     'updateListRequest', 'updateListSuccess', 'updateListFailed', 'changeFile', 'refresh']
  );
  mockPageActions.initializeListSuccess.and.callFake((files, numDisplayed) => {
    resultFiles = files.map(file => file.name + '.html'); // pluck name from passed IFileInfos
    numToDisplay = numDisplayed;
  });
  return mockPageActions;
};
