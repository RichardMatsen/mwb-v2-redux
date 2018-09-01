import { TestBed, async, inject } from '@angular/core/testing';
import { Compiler } from '@angular/core';

import { HttpModule, Http, BaseRequestOptions, ConnectionBackend, Response, ResponseOptions, Headers, RequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';

import { IAppState } from '../store/state/AppState';
import { IFileInfo } from '../model/fileInfo.model';
import { MeasureService } from './measure.service';
import { ValidationsDataService } from '../linqpad-review-pages/validations/services/validations-data.service';
import { ReferentialsDataService } from '../linqpad-review-pages/referentials/services/referentials-data.service';
import { ClinicsDataService } from '../linqpad-review-pages/clinics/services/clinics-data.service';
import { ValidationsActions } from '../store/actions/validations.actions';
import { ReferentialsActions } from '../store/actions/referentials.actions';
import { ClinicsActions } from 'app/store/actions/clinics.actions';
import { Logger } from '../common/mw.common.module';
import { setupMockStore, addtoMockStore, mockFactory } from 'testing-helpers/testing-helpers.module.hlpr';
import { MeasureActions } from 'app/store/actions/measure.actions';
import { PageActions } from '../store/actions/page.actions';
import { TestStoreModule } from 'testing-helpers/ngRedux-testing/test-store.module';

describe('MeasureService', () => {

  const mockPageActions = mockFactory(PageActions);
  const mockMeasureActions = mockFactory(MeasureActions);

  const mockValidationsDataService = jasmine.createSpyObj('mockValidationsDataService', ['getMeasure', 'initializeList']);
  mockValidationsDataService.initializeList.and.callFake(filesToInit => Observable.of([]));

  const mockReferentialsDataService = jasmine.createSpyObj('mockReferentialsDataService', ['getMeasure', 'initializeList']);
  mockReferentialsDataService.initializeList.and.callFake(filesToInit => Observable.of([]));

  const mockClinicsDataService = jasmine.createSpyObj('mockClinicsDataService', ['getMeasure', 'initializeList']);
  mockClinicsDataService.initializeList.and.callFake(filesToInit => Observable.of([]));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        NgReduxTestingModule,
        TestStoreModule
      ],
      providers: [
        MockBackend,
        BaseRequestOptions,
        {provide: ConnectionBackend, useClass: MockBackend},
        {provide: RequestOptions, useClass: BaseRequestOptions},
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        },
        {provide: ValidationsDataService, useValue: mockValidationsDataService},
        {provide: ReferentialsDataService, useValue: mockReferentialsDataService},
        {provide: ClinicsDataService, useValue: mockClinicsDataService},
        {provide: ValidationsActions, useValue: mockPageActions},
        {provide: ReferentialsActions, useValue: mockPageActions},
        {provide: ClinicsActions, useValue: mockPageActions},
        {provide: MeasureActions, useValue: mockMeasureActions},
        MeasureService,
        MockNgRedux
      ],
    });
  });

  let measureService;
  beforeEach(
    inject([MeasureService], (measureService_) => {
      measureService = measureService_;
    }
  ));

  it('should create the service', () => {
    expect(measureService).toBeTruthy();
  });

  describe('initializeMeasures()', () => {

    const measureData = {
      measures: [
        { id: 'measure1', title: 'measure1', metric: '0', color: 'grey', icon: '', link: '' },
        { id: 'measure2', title: 'measure2', metric: '10', color: 'red', icon: '', link: '' },
        { id: 'measure3', title: 'measure3', metric: '242', color: 'orange', icon: '', link: '' },
      ]
    };

    let mockBackend;
    beforeEach(
      inject([MockBackend], (mockBackend_) => {
        mockBackend = mockBackend_;
      }
    ));

    beforeEach(() => {
      mockMeasureActions.initializeMeasuresSuccess.calls.reset();
      mockMeasureActions.initializeMeasuresFailed.calls.reset();
    });

    describe('when measures have already been initialized', () => {

      it('should not dispatch any actions', () => {
        setupMockStore(['config', 'baseDataUrl'], '/data/' );
        addtoMockStore(['measures'], measureData.measures );
        measureService.initializeMeasures();
        expect(mockMeasureActions.initializeMeasuresSuccess).not.toHaveBeenCalled();
        expect(mockMeasureActions.initializeMeasuresFailed).not.toHaveBeenCalled();
      });
    });

    describe('when measures have not yet been initialized', () => {

      describe('when http.get succeeds', () => {
        it('should pass measures to initializeMeasuresSuccess', () => {
          setupMockStore(['config', 'baseDataUrl'], '/data/' );
          addtoMockStore(['measures'], null );
          mockBackend.connections.subscribe(conn => {
            conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(measureData) })));
          });
          measureService.initializeMeasures();
          expect(mockMeasureActions.initializeMeasuresSuccess).toHaveBeenCalledWith(measureData.measures);
        });
      });

    });

    describe('when getMeasures fails', () => {
      it('should pass error to initializeMeasuresFailed', () => {
        const error = new Error('expected error for test case - when getMeasures fails');
        setupMockStore(['config', 'baseDataUrl'], '/data/' );
        addtoMockStore(['measures'], null );
        mockBackend.connections.subscribe(conn => {
          conn.mockError(error);
        });

        measureService.initializeMeasures();
        expect(mockMeasureActions.initializeMeasuresFailed).toHaveBeenCalledWith(error);
      });
    });

  });

  describe('updateMeasures()', () => {

    beforeEach( () => {
      mockValidationsDataService.getMeasure.and.callFake(function() {
        return Observable.of( { id: 'validations', metric: '12', color: 'orange' } );
      });
      mockReferentialsDataService.getMeasure.and.callFake(function() {
        return Observable.of( { id: 'referentials', metric: '13', color: 'orange' } );
      });
      mockClinicsDataService.getMeasure.and.callFake(function() {
        return Observable.of( { id: 'clinics', metric: '14', color: 'orange' } );
      });
      mockMeasureActions.updateMeasure.calls.reset();
    });

    it('should dispatch update actions', () => {
      setupMockStore(['config', 'baseDataUrl'], '/data/' );
      addtoMockStore(['measures'], [
          { id: 'validations',  metric: '54', color: 'red' },
          { id: 'referentials', metric: '54', color: 'red' },
          { id: 'clinics',      metric: '54', color: 'red' },
        ]
      );
      addtoMockStore(['pages', 'validations', 'files'], [] );
      addtoMockStore(['pages', 'referentials', 'files'], [] );
      addtoMockStore(['pages', 'clinics', 'files'], [] );

      measureService.updateMeasures();
      expect(mockMeasureActions.updateMeasure).toHaveBeenCalledWith({id: 'validations',  metric: '12', color: 'orange'});
      expect(mockMeasureActions.updateMeasure).toHaveBeenCalledWith({id: 'referentials', metric: '13', color: 'orange'});
      expect(mockMeasureActions.updateMeasure).toHaveBeenCalledWith({id: 'clinics',      metric: '14', color: 'orange'});
    });

    it('should invoke pageAction.initializeList if file list is null', () => {
      setupMockStore(['config', 'baseDataUrl'], '/data/' );
      addtoMockStore(['measures'], [
          { id: 'validations',  metric: '54', color: 'red' },
          { id: 'referentials', metric: '54', color: 'red' },
          { id: 'clinics',      metric: '54', color: 'red' },
        ]
      );
      addtoMockStore(['pages', 'validations', 'files'], null);
      addtoMockStore(['pages', 'referentials', 'files'], null );
      addtoMockStore(['pages', 'clinics', 'files'], null );

      measureService.updateMeasures();
      expect(mockValidationsDataService.initializeList).toHaveBeenCalled();
      expect(mockReferentialsDataService.initializeList).toHaveBeenCalled();
      expect(mockClinicsDataService.initializeList).toHaveBeenCalled();
    });

    it('should ignore measure update if no change to existing measure', () => {
      setupMockStore(['config', 'baseDataUrl'], '/data/' );
      addtoMockStore(['measures'], [
          { id: 'validations',  metric: '12', color: 'orange' },
          { id: 'referentials', metric: '13', color: 'orange' },
          { id: 'clinics',      metric: '14', color: 'orange' },
        ]
      );
      addtoMockStore(['pages', 'validations', 'files'], [] );
      addtoMockStore(['pages', 'referentials', 'files'], [] );
      addtoMockStore(['pages', 'clinics', 'files'], [] );

      measureService.updateMeasures();
      expect(mockMeasureActions.updateMeasure).not.toHaveBeenCalled();
    });

  });

});
