/* tslint:disable:max-line-length */

import 'app/rxjs-extensions';
import { TestBed, async, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';

import { IFileInfo } from 'app/model/fileinfo.model';
import { ClinicsDataService } from './clinics-data.service';
import { ClinicsFormatService } from './clinics-format.service';
import { DataService } from 'app/services/data-service/data.service';
import { NameParsingService } from 'app/services/data-service/name-parsing.service';
import { FileService } from 'app/services/file-service/file.service';
import { ListFormatterService } from 'app/services/list-formatter.service/list-formatter.service';
import { Logger } from 'app/common/mw.common.module';
import { setupMockStore, addtoMockStore, setupMockFileService } from 'testing-helpers/testing-helpers.module.hlpr';
import { toHavePropertiesMatcher } from 'testing-helpers/jasmine-matchers/to-have-properties.matcher';
import { mockFactory } from 'testing-helpers/testing-helpers.module.hlpr';
import { StoreService } from 'app/store/store.service';
import { TestStoreModule } from 'testing-helpers/ngRedux-testing/test-store.module';

describe('ClinicsDataService', () => {

  let mockLogger, mockFileService, store;
  beforeEach(() => {
    mockFileService = setupMockFileService();
    mockLogger = jasmine.createSpyObj('mockLogger', ['log', 'error']);

    TestBed.configureTestingModule({
      imports: [
        NgReduxTestingModule,
        TestStoreModule
      ],
      providers: [
        NameParsingService,
        ListFormatterService,
        { provide: FileService, useValue: mockFileService },
        { provide: Logger, useValue: mockLogger },
        ClinicsFormatService,
        ClinicsDataService,
        MockNgRedux,
      ],
    });
    TestBed.compileComponents();
    store = TestBed.get(StoreService)
    const files: IFileInfo[] = [
      { name: 'tester6 06 Jun 2016', effectiveDate: new Date('2016-06-06T12:03:00Z'), content: 'some content', metric: '1%', badgeColor: 'orange' },
      { name: 'tester5 06 Jun 2016', effectiveDate: new Date('2016-06-06T12:02:00Z'), content: 'some content', metric: '2%', badgeColor: 'red' },
      { name: 'tester4 06 Jun 2016', effectiveDate: new Date('2016-06-06T12:01:00Z'), content: 'some content', metric: '3%', badgeColor: 'green' },
      { name: 'tester3 03 Jun 2016', effectiveDate: new Date('2016-06-03T12:01:00Z'), content: 'some content', metric: '4%', badgeColor: 'gray' },
      { name: 'tester2 02 Jun 2016', effectiveDate: new Date('2016-06-02T12:01:00Z'), content: 'some content', metric: '5%', badgeColor: 'blue' },
      { name: 'tester1 01 Jun 2016', effectiveDate: new Date('2016-06-01T12:01:00Z'), content: 'some content', metric: '6%', badgeColor: 'natch' }
    ];
    setupMockStore(['pages', 'clinics', 'files'], files );
    addtoMockStore(['config', 'baseDataUrl'], '/data/' );
    addtoMockStore(['config', 'clinicsConfig'], { filePrefixes: ['Clinics'], numDataPointsForSparkline: 14, numInitialFilesToDisplay: 4 } );
  });

  let clinicsDataService;
  beforeEach(
    inject([ClinicsDataService], (dataService_) => {
      clinicsDataService = dataService_;
    })
  );

  beforeEach( () => {
    jasmine.addMatchers(toHavePropertiesMatcher);
  });

  it('should be instantiated', () => {
    expect(clinicsDataService).toBeTruthy();
  });

  describe('initializeList()', () => {
    it('should get config', () => {
      const testFiles: string[] = [ 'file1 01 Jun 2016.html', 'file2 01 Jun 2016.html', 'file3 01 Jun 2016.html'];
      mockFileService.getFileList.and.returnValue(Observable.from(testFiles));
      const spy_super_InitilizeList = spyOn( DataService.prototype, 'initializeFileList' );

      clinicsDataService.initializeList();
      expect(clinicsDataService.filePrefixes).toBeDefined('filePrefixes');
      expect(clinicsDataService.filesToInit).toBeDefined('filesToInit');
      expect(clinicsDataService.filesToDisplay).toBeDefined('filesToDisplay');
      expect(spy_super_InitilizeList).toHaveBeenCalled();
    });
  });

  describe('getMeasure()', () => {

    it('should return metric and color of the latest file', () => { 
      let flag = false;
      clinicsDataService.getMeasure()
        .subscribe(result => {
          flag = true;
          expect(result).toHaveProperties( {
            id: 'clinics',
            metric: '1%',
            color: 'orange'
          });
        });
      expect(flag).toBeTruthy();
    });

    it('should return history of values', () => {
      let flag = false;
      clinicsDataService.getMeasure()
        .subscribe(result => {
          flag = true;
          expect(result.history).toEqual([6, 5, 4, 3, 2, 1]);
        });
      expect(flag).toBeTruthy();
    });

  });
});
