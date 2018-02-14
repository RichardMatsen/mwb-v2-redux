/* tslint:disable:no-unused-variable */
/* tslint:disable:max-line-length */

import '../../rxjs-extensions';
import { Injectable } from '@angular/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';

import { IFileInfo } from '../../model/fileinfo.model';
import { DataService } from './data.service';
import { NameParsingService } from './name-parsing.service';
import { FormatService } from './format.service';
import { ListFormatterService } from '../list-formatter.service/list-formatter.service';
import { FileService } from '../file-service/file.service';
import { Logger } from '../../common/mw.common.module';
import { PageActions } from '../../linqpad-review-pages/common/page.actions';
import { setupMockStore,
         subscribeAndExpectAllValues, subscribeAndExpectValue,
         setupMockFormatService, setupMockFileService, setupMockPageActions
       } from 'testing-helpers/testing-helpers.module.hlpr';

@Injectable()
class TestDataService extends DataService {
  @select(['pages', 'testPage', 'files']) files$: Observable<IFileInfo[]>;
  @select(['config', 'testConfig']) config$: Observable<any>;
  public baseUrl = './data/assets/';
  public filePrefixes = ['file'];
  public PAGE = 'testPage';

  constructor (
    protected formatService: FormatService,
    protected nameParsingService: NameParsingService,
    protected listFormatterService: ListFormatterService,
    protected fileService: FileService,
    protected logger: Logger,
    protected pageActions: PageActions,
  ) {
    super(formatService, nameParsingService, listFormatterService, fileService, logger, pageActions);
  }

  public initializeList() {
    super.initializeList(10, 5);
  }

  public getMeasure(): Observable<any> { return Observable.empty(); }
}

describe('DataService', () => {

  let mockFormatService, mockLogger, mockFileService, mockPageActions;

  beforeEach(() => {
    mockFormatService = setupMockFormatService();
    mockFileService = setupMockFileService();
    mockLogger = jasmine.createSpyObj('mockLogger', ['log', 'error']);
    mockPageActions = setupMockPageActions();

    TestBed.configureTestingModule({
      imports: [
        NgReduxTestingModule,
      ],
      providers: [
        { provide: FormatService, useValue: mockFormatService },
        NameParsingService,
        ListFormatterService,
        { provide: FileService, useValue: mockFileService },
        { provide: Logger, useValue: mockLogger },
        { provide: PageActions, useValue: mockPageActions },
        TestDataService,
      ],
    });
    TestBed.compileComponents();

    const files: IFileInfo[] = [
      { name: 'tester6 06 Jun 2016', effectiveDate: new Date('2016-06-06T12:03:00Z'), content: 'some content', metric: 1, badgeColor: 'orange' },
      { name: 'tester5 06 Jun 2016', effectiveDate: new Date('2016-06-06T12:02:00Z'), content: 'some content', metric: 2, badgeColor: 'red' },
      { name: 'tester4 06 Jun 2016', effectiveDate: new Date('2016-06-06T12:01:00Z'), content: 'some content', metric: 3, badgeColor: 'green' },
      { name: 'tester3 03 Jun 2016', effectiveDate: new Date('2016-06-03T12:01:00Z'), content: 'some content', metric: 4, badgeColor: 'gray' },
      { name: 'tester2 02 Jun 2016', effectiveDate: new Date('2016-06-02T12:01:00Z'), content: 'some content', metric: 5, badgeColor: 'blue' },
      { name: 'tester1 01 Jun 2016', effectiveDate: new Date('2016-06-01T12:01:00Z'), content: 'some content', metric: 6, badgeColor: 'natch' }
    ];
    setupMockStore(['pages', 'testPage', 'files'], files );
  });

  let dataService;
  beforeEach(
    inject([TestDataService], (dataService_) => {
      dataService = dataService_;
  }));

  fit('should create the service', () => {
    expect(dataService).toBeTruthy();
  });

  describe('initializeList()', () => {
    /*
      Method: initializeList(numToInitialize, numToDisplay)
      - reads list of files with specified prefix
      - orders them by date/time descending
      - processes content for first(numToInitialize)
      - sets the initial number to be displayed
    */

    it('should dispatch action INITIALIZE_FILES_REQUEST', () => {
      /* Starts the spinner */
      const testFiles = [ 'file1 01 Jun 2016.html', 'file2 01 Jun 2016.html', 'file3 01 Jun 2016.html'];
      mockFileService.getFileList.and.returnValue(Observable.from(testFiles));

      dataService.initializeList();
      expect(mockPageActions.initializeListRequest).toHaveBeenCalled();
    });

    describe('when file list fetch succeeds', () => {

      let filesCalled, numToDisplayCalled;
      beforeEach(() => {
        mockPageActions.initializeListSuccess.and.callFake( (fileInfos, numToDisplay) => {
          filesCalled = fileInfos.map(f => f.name + '.html');
          numToDisplayCalled = numToDisplay;
        });
      });

      it('should dispatch action INITIALIZE_FILES_SUCCESS with a list of files and number to display', () => {
        const testFiles = [ 'file1 01 Jun 2016.html', 'file2 01 Jun 2016.html', 'file3 01 Jun 2016.html'];
        mockFileService.getFileList.and.returnValue(Observable.from(testFiles));

        dataService.initializeList();
        expect(mockPageActions.initializeListSuccess).toHaveBeenCalled();
        expect(filesCalled).toEqual(testFiles);
        expect(numToDisplayCalled).toBe(5);
      });

      it('should be sorted on effectiveDate descending', () => {
        const testFiles = [ 'file1 01 Jun 2016.html', 'file2 02 Jun 2016.html', 'file3 03 Jun 2016.html'];
        mockFileService.getFileList.and.returnValue(Observable.from(testFiles));

        dataService.initializeList();
        expect(mockPageActions.initializeListSuccess).toHaveBeenCalled();
        expect(filesCalled).toEqual(testFiles.reverse());
        expect(numToDisplayCalled).toBe(5);
      });

      it('should be sorted on effectiveTime descending', () => {
        const testFiles = [ 'file2 01 Jun 2016 - 17.30.html', 'file1 01 Jun 2016 - 10.15.html', 'file3 01 Jun 2016 - 19.45.html' ];
        mockFileService.getFileList.and.returnValue(Observable.from(testFiles));

        dataService.initializeList();
        const expectedFiles = [ 'file3 01 Jun 2016 - 19.45.html', 'file2 01 Jun 2016 - 17.30.html', 'file1 01 Jun 2016 - 10.15.html' ];
        expect(mockPageActions.initializeListSuccess).toHaveBeenCalled();
        expect(filesCalled).toEqual(expectedFiles);
        expect(numToDisplayCalled).toBe(5);
      });

      it('should call getContentForList$()', () => {
        const testFiles = [ 'file1 01 Jun 2016.html', 'file2 01 Jun 2016.html', 'file3 01 Jun 2016.html'];
        mockFileService.getFileList.and.returnValue(Observable.from(testFiles));
        const spy = spyOn(dataService, 'getContentForList$').and.callThrough();

        dataService.initializeList();
        expect(spy).toHaveBeenCalled();
      });

    });

    describe('when file list fetch fails', () => {
      it('should dispatch action INITIALIZE_FILES_FAILED with error', () => {
        const error = new Error('an error occurred');
        mockFileService.getFileList.and.returnValue(Observable.throw(error));

        dataService.initializeList(1, 1);
        expect(mockPageActions.initializeListFailed).toHaveBeenCalledWith(error);
      });
    });

    describe('when individual file fetch fails', () => {
      it('should dispatch action INITIALIZE_FILES_FAILED with error', () => {
        const testFiles = [ 'file2 01 Jun 2016 - 17.30.html', 'file1 01 Jun 2016 - 10.15.html', 'file3 01 Jun 2016 - 19.45.html' ];
        mockFileService.getFileList.and.returnValue(Observable.from(testFiles));
        const error = new Error('an error occurred');
        mockFileService.getFile.and.returnValue(Observable.throw(error));
        const spy = spyOn(dataService, 'handleError').and.callThrough();

        dataService.initializeList(1, 1);
        expect(mockPageActions.initializeListFailed).toHaveBeenCalledWith(error);
      });
    });

  });

  describe('getContentForList$()', () => {
    /*
      Read and process content of the first n files in the list.
      Append the content to the file object.
      Return the complete list, preserving the same order as input list.
     */

    const testFiles = [ 'file1 01 Jun 2016.html', 'file2 01 Jun 2016.html', 'file3 01 Jun 2016.html'];
    const observableFiles = Observable.from( testFiles.map(name => { return { name: name, effectiveDate: new Date() }; }) );

    it('should return an observable array of objects', () => {
      dataService.getContentForList$(observableFiles, 2)
        .subscribe(filesOut => {
          expect(filesOut.length).toEqual(3);
        });
    });

    it('should get content for first(numToInitialize) of the list', () => {
      dataService.getContentForList$(observableFiles, 2)
        .subscribe(filesOut => {
          expect(filesOut[0].content).toBeDefined();
          expect(filesOut[1].content).toBeDefined();
          expect(filesOut[2].content).not.toBeDefined();
        });
    });

    it('should return files in same order', () => {
      dataService.getContentForList$(observableFiles, 2)
        .subscribe(filesOut => {
          const names = filesOut.map(f => f.name);
          expect(names).toEqual(testFiles);
        });
    });

    describe('when fileService.getFile(url) fails', () => {

      it('should return an error', () => {
        const error = new Error('some error');
        mockFileService.getFile.and.returnValue(Observable.throw(error));

        dataService.getContentForList$(observableFiles, 2)
          .subscribe(
            _ => {},
            (error_) => {
              expect(error_).toEqual(error);
            });
      });

      it('should log the error in the handleError method', () => {
        const error = new Error('some error');
        mockFileService.getFile.and.returnValue(Observable.throw(error));

        const calls = [];
        const spy = spyOn(dataService, 'handleError').and.callFake((error_, caller) => {
          calls.push(caller);
          return Observable.throw(error_);
        });

        dataService.getContentForList$(observableFiles, 2)
          .subscribe(
            (next_) => {},
            (error_) => {
              expect(calls).toEqual(['getContent', 'getContentForList$']);
            });
      });
    });

  });

  describe('getFileListFromFolder()', () => {
    /* Get list of all files with required prefix from disk */

    const testFiles = [ 'file1 01 Jun 2016.html', 'file2 01 Jun 2016.html', 'file3 01 Jun 2016.html'];
    beforeEach(() => {
      mockFileService.getFileList.and.returnValue(Observable.from(testFiles));
    });

    it('should return a list of files', () => {
      const sut$ = dataService.getFileListFromFolder().map(file => { return file.name; });
      subscribeAndExpectAllValues( sut$, ['file1 01 Jun 2016', 'file2 01 Jun 2016', 'file3 01 Jun 2016'] );
    });

  });

  describe('updateList(numdisplayed)', () => {
    /* Ensures content is processed for 'numdisplayed' files when file list is expanded */

    const testFiles = [ 'file1 01 Jun 2016.html', 'file2 01 Jun 2016.html', 'file3 01 Jun 2016.html'];

    it('should dispatch action UPDATE_FILES_REQUEST', () => {
      dataService.updateList(2);
      expect(mockPageActions.updateListRequest).toHaveBeenCalled();
    });

    it('should call getContentForList$()', () => {
      mockFileService.getFileList.and.returnValue(Observable.from(testFiles));
      const spy = spyOn(dataService, 'getContentForList$').and.callThrough();

      dataService.initializeList();
      expect(spy).toHaveBeenCalled();
    });

    describe('when getContentForList$ succeeds', () => {

      it('should dispatch action UPDATE_FILES_SUCCESS with a list of files and number to display', () => {
        setupMockStore(['pages', 'testPage', 'files'], testFiles.map(name => { return { name: name, effectiveDate: new Date() }; }) );

        let filesCalled, numToDisplayCalled;
        mockPageActions.updateListSuccess.and.callFake( (fileInfos, numToDisplay) => {
          filesCalled = fileInfos.map(f => f.name);
          numToDisplayCalled = numToDisplay;
        });

        dataService.updateList(2);
        expect(mockPageActions.updateListSuccess).toHaveBeenCalled();
        expect(filesCalled).toEqual(testFiles);
        expect(numToDisplayCalled).toBe(2);
      });

    });

    describe('when getContentForList$ fails', () => {

      it('should dispatch action UPDATE_FILES_FAILED with the error', () => {
        const error = new Error('some error');
        const spy = spyOn(dataService, 'getContentForList$').and.callFake(() => {
          return Observable.throw(error);
        });

        let errorCalled;
        mockPageActions.updateListFailed.and.callFake( error_ => {
          errorCalled = error_;
        });

        dataService.updateList(2);
        expect(mockPageActions.updateListFailed).toHaveBeenCalled();
        expect(errorCalled).toEqual(error);
      });

    });

  });

  describe('filesByDate()', () => {
    it('should group files by effectiveDate', () => {
      const testFiles = [
        { name: 'file1 01 Jun 2016.html', effectiveDate: new Date(2016, 6, 1) }, { name: 'file2 01 Jun 2016.html', effectiveDate: new Date(2016, 6, 1) },
        { name: 'file3 01 Jun 2016.html', effectiveDate: new Date(2016, 6, 2) }, { name: 'file1 02 Jun 2016.html', effectiveDate: new Date(2016, 6, 2) },
        { name: 'file2 02 Jun 2016.html', effectiveDate: new Date(2016, 6, 3) }, { name: 'file3 02 Jun 2016.html', effectiveDate: new Date(2016, 6, 3) }
      ];

      const groups = dataService.filesByDate(testFiles);
      expect(groups.length).toEqual(3);
      expect(groups.map(g => g.date)).toEqual( [ '2016-07-01', '2016-07-02', '2016-07-03' ] );
      expect(groups.map(g => g.files.length)).toEqual( [ 2, 2, 2 ] );
    });
  });

});
