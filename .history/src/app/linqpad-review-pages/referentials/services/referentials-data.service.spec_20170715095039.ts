import '../../../rxjs-extensions';
import { TestBed, async, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';

import { IFileInfo } from '../../../model/FileInfo';
import { ReferentialsDataService } from './referentials-data.service';
import { ReferentialsFormatService } from './referentials-format.service';
import { DataService } from '../../../services/data-service/data.service';
import { NameParsingService } from '../../../services/data-service/name-parsing.service';
import { FileService } from '../../../services/file-service/file.service';
import { ListFormatterService } from '../../../services/list-formatter.service/list-formatter.service';
import { Logger } from '../../../common/mw.common.module';
import { ReferentialsActions } from './referentials.actions';
import {} from '../../../services/list-formatter.service/list-formatter-observable-extensions';
import { setupMockStore, addtoMockStore, setupMockFormatService, setupMockFileService,
         subscribeAndExpectAllValues, subscribeAndExpectValue, subscribeAndExpectNoDataEmitted
       } from 'testing-helpers/testing-helpers.module.hlpr';
import { toHavePropertiesMatcher } from 'testing-helpers/jasmine-matchers/to-have-properties.matcher';

describe('ReferentialsDataService', () => {

  let mockLogger, mockFileService;

  beforeEach(() => {
    mockFileService = setupMockFileService();
    mockLogger = jasmine.createSpyObj('mockLogger', ['log', 'error']);

    TestBed.configureTestingModule({
      imports: [
        NgReduxTestingModule,
      ],
      providers: [
        DataService,
        NameParsingService,
        ListFormatterService,
        { provide: FileService, useValue: mockFileService },
        { provide: Logger, useValue: mockLogger },
        ReferentialsFormatService,
        ReferentialsDataService,
        ReferentialsActions,
      ],
    });
    TestBed.compileComponents();

    const files: IFileInfo[] = [
      { name: 'tester6 06 Jun 2016', effectiveDate: new Date('2016-06-06T12:01:00Z'), content: 'some content', metric: 1 },
      { name: 'tester5 06 Jun 2016', effectiveDate: new Date('2016-06-06T12:01:00Z'), content: 'some content', metric: 2 },
      { name: 'tester4 06 Jun 2016', effectiveDate: new Date('2016-06-06T12:01:00Z'), content: 'some content', metric: 3 },
      { name: 'tester3 03 Jun 2016', effectiveDate: new Date('2016-06-03T12:01:00Z'), content: 'some content', metric: 5 },
      { name: 'tester2 02 Jun 2016', effectiveDate: new Date('2016-06-02T12:01:00Z'), content: 'some content', metric: 7 },
      { name: 'tester1 01 Jun 2016', effectiveDate: new Date('2016-06-01T12:01:00Z'), content: 'some content', metric: 9 }
    ];
    setupMockStore(['pages', 'referentials', 'files'], files );
    addtoMockStore(['config', 'baseDataUrl'], '/data/' );
    addtoMockStore(['config', 'referentialsConfig'], { filePrefixes: ['test'], daysToInitialize: 3, daysToDisplay: 1 } );
  });

  let referentialsDataService;
  beforeEach(
    inject([ReferentialsDataService], (referentialsDataService_) => {
      referentialsDataService = referentialsDataService_;
    })
  );

  describe('ReferentialsDataService', () => {

    describe('getConfig$()', () => {
      /*
        Wait for config to be loaded and copy values locally.
        Subscribed by initializeList(), effectively puts a wait in that method.
      */
      it('should get config', (done) => {
        const testFiles: string[] = [ 'file1 01 Jun 2016.html', 'file2 01 Jun 2016.html', 'file3 01 Jun 2016.html'];
        mockFileService.getFileList.and.returnValue(Observable.from(testFiles));

        let wasSubscribed = false;
        referentialsDataService.getConfig$()
          .subscribe(
            (_) => {
              expect(referentialsDataService.filePrefixes).toBeDefined('filePrefixes');
              expect(referentialsDataService.daysToInitialize).toBeDefined('daysToInitialize');
              expect(referentialsDataService.daysToDisplay).toBeDefined('daysToDisplay');
              wasSubscribed = true;
              done();
            },
            (error) => {},
            (/* complete */) => {
              expect(wasSubscribed).toBeTruthy();
            }
          );
      });
    });

    describe('initializeList()', () => {
      /*
        Calculate filesToInit and filesToDisplay from daysToInitialize and daysToDisplay in config.
        Call super.initializeList()
      */
      it('should call getCountFilesForLastNDays()', () => {
        const testFiles: string[] = [ 'file1 01 Jun 2016.html', 'file2 01 Jun 2016.html', 'file3 01 Jun 2016.html'];
        mockFileService.getFileList.and.returnValue(Observable.from(testFiles));

        const spy_getCountFilesForLastNDays = spyOn(referentialsDataService, 'getCountFilesForLastNDays').and.callThrough();
        const spy_super_InitilizeList = spyOn( DataService.prototype, 'initializeList' );

        referentialsDataService.initializeList();
        expect(spy_getCountFilesForLastNDays).toHaveBeenCalledTimes(2);
        expect(spy_super_InitilizeList).toHaveBeenCalled();
      });
    });

    describe('getCountFilesForLastNDays()', () => {
      /* Get the number of files for the last n days */
      it('should call getCountFilesForLastNDays()', () => {
        const testFiles = [
          { name: 'file1 01 Jun 2016.html', effectiveDate: new Date(2016, 6, 1) },
          { name: 'file2 02 Jun 2016.html', effectiveDate: new Date(2016, 6, 2) },
          { name: 'file3 02 Jun 2016.html', effectiveDate: new Date(2016, 6, 2) },
          { name: 'file4 03 Jun 2016.html', effectiveDate: new Date(2016, 6, 3) }
        ];

        const result = referentialsDataService.getCountFilesForLastNDays(2, testFiles);
        expect(result).toEqual(3);
      });
    });

    describe('getMeasure()', () => {

      beforeEach( () => {
        jasmine.addMatchers(toHavePropertiesMatcher);
      });

      it('should return total metric of all files with the latest effectiveDate', () => {
        let flag = false;
        referentialsDataService.getMeasure()
          .subscribe(result => {
            flag = true;
            expect(result).toHaveProperties( {
              id: 'referentials',
              metric: '6',
              color: 'orange'
            });
          });
        expect(flag).toBeTruthy();
      });

      it('should return history of values', () => {
        let flag = false;
        referentialsDataService.getMeasure()
          .subscribe(result => {
            flag = true;
            expect(result.history).toEqual([9, 7, 5, 6]);
          });
        expect(flag).toBeTruthy();
      });

    });

  });
});
