/* tslint:disable:max-line-length */

import 'app/rxjs-extensions';
import { Location, CommonModule } from '@angular/common';
import { TestBed, async, inject } from '@angular/core/testing';
import { RouterModule, Router, ActivatedRoute, Params, provideRoutes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions, Headers, RequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';
import { Observable } from 'rxjs/Observable';

import { FileService } from './file.service';
import { FileActions } from '../../store/actions/file.actions';
import { UiActions } from 'app/store/actions/ui.actions';
import { Logger, loggerFactory } from 'app/common/mw.common.module';
import {
  subscribeAndExpectAllValues, subscribeAndExpectValue, subscribeAndExpectNoDataEmitted,
  DummyAppComponent, DummyTargetComponent,
  setupMockStore, addtoMockStore,
} from 'testing-helpers/testing-helpers.module.hlpr';
import { StoreService } from 'app/store/store.service';
import { TestStoreModule } from 'testing-helpers/ngRedux-testing/test-store.module';

describe('FileService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        RouterTestingModule.withRoutes([
          { path: '404', component: DummyTargetComponent }
        ]),
        CommonModule,
        NgReduxTestingModule,
        TestStoreModule
      ],
      declarations: [
        DummyTargetComponent,
      ],
      providers: [
        MockNgRedux,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: Logger, useFactory: loggerFactory },
        FileService,
        FileActions,
        UiActions,
        StoreService
      ]
    }).compileComponents();
  });

  let fileService, fileActions, uiActions, mockBackend;
  beforeEach(
    inject([FileService, FileActions, UiActions, MockBackend],
      (fileService_, fileActions_, uiActions_, mockBackend_) => {
        fileService = fileService_;
        fileActions = fileActions_;
        uiActions = uiActions_;
        mockBackend = mockBackend_;
      })
  );

  it('should create the service', () => {
    expect(fileService).toBeTruthy();
  });

  describe('constructor dependencies', () => {

    let http, router, store, logger;
    beforeEach(
      inject([Http, Router, StoreService, Logger], (http_, router_, store_, logger_) => {
        http = http_;
        router = router_;
        store = store_;
        logger = logger_;
    }));

    it('should inject dependencies', () => {
      // Ref: https://github.com/angular/angular-cli/issues/5871
      const fileService_ = new FileService(http, router, logger, store);
      expect(fileService_.http).toBeDefined('http');
      expect(fileService_.router).toBeDefined('router');
      expect(fileService_.store).toBeDefined('store');
      expect(fileService_.logger).toBeDefined('logger');
    });

  });

  const setup_404ActionDispatch = () => {
    const error = new Response(new ResponseOptions({status: 404, url: 'some url', body: 'some error'}));
    mockBackend.connections.subscribe((conn: MockConnection) => {
      // Ref: https://github.com/angular/angular/issues/7135 - double cast Response to Error
      conn.mockError(error as any as Error);
    });
    return error;
  };

  const setup_MockDirectoryFile = (data) => {
    const file = data.join('\n');
    mockBackend.connections.subscribe((conn: MockConnection) => {
      conn.mockRespond(new Response(new ResponseOptions({ body: file })));
    });
  };

  describe('getFileList()', () => {

    describe('when http.get succeeds', () => {

      it('should dispatch the list of file names to the store', () => {
        const data = [ 'file1', 'file2', 'file3' ];
        setup_MockDirectoryFile(data);
        setupMockStore(['file', 'fileList'], { files: null } );
        const spy = spyOn(fileActions, 'setFileListSuccess');

        fileService.getFileList('some url');
        expect(spy).toHaveBeenCalledWith(data);
      });

      it('should dispatch a pending flag to the store', () => {
        const data = [ 'file1', 'file2', 'file3' ];
        setup_MockDirectoryFile(data);
        setupMockStore(['file', 'fileList'], { files: null } );
        const spy = spyOn(fileActions, 'setFileListPending');

        fileService.getFileList('some url');
        expect(spy).toHaveBeenCalledWith(true);
      });

      it('should dispatch empty list when there are no files at the location', () => {
        const data = [ ];
        setup_MockDirectoryFile(data);
        setupMockStore(['file', 'fileList'], { files: null } );
        const spy = spyOn(fileActions, 'setFileListSuccess');

        fileService.getFileList('some url');
        expect(spy).toHaveBeenCalledWith(data);
      });

      it('should NOT dispatch the file list when the store is already populated', () => {
        const data = [ 'file1', 'file2', 'file3' ];
        setup_MockDirectoryFile(data);
        setupMockStore(['file', 'fileList'], { files: data } );
        const spy = spyOn(fileActions, 'setFileListSuccess');

        fileService.getFileList('some url');
        expect(spy).not.toHaveBeenCalled();
      });

      it('should NOT dispatch the file list when the store has a pending flag', () => {
        const data = [ 'file1', 'file2', 'file3' ];
        setup_MockDirectoryFile(data);
        setupMockStore(['file', 'fileList'], { pending: true } );
        const spy = spyOn(fileActions, 'setFileListSuccess');

        fileService.getFileList('some url');
        expect(spy).not.toHaveBeenCalled();
      });

    });

    describe('when http.get fails', () => {
      it('should dispatch a Four0Four action when http.get fails', () => {
        const error = setup_404ActionDispatch();
        setupMockStore(['file', 'fileList'], { files: null } );
        const setFileListFailedSpy = spyOn(fileActions, 'setFileListFailed');
        const setFour0FourMessageSpy = spyOn(uiActions, 'setFour0FourMessage');

        try {
          fileService.getFileList('url');
        } catch (error) {

        }
        expect(setFileListFailedSpy).toHaveBeenCalledWith(error);
        expect(setFour0FourMessageSpy).toHaveBeenCalled();
      });
    });

  });

  describe('getFile()', () => {

    describe('when http.get succeeds', () => {
      it('should return the raw response', () => {
        const response = new Response(new ResponseOptions({status: 404, url: 'some url', body: 'some content'}));
        mockBackend.connections.subscribe((conn: MockConnection) => {
          conn.mockRespond(response);
        });

        fileService.getFile('some url')
          .subscribe(response_ => {
            expect(response_).toBe(response);
          });
      });
    });

    describe('when http.get fails', () => {

      let router, location;
      beforeEach(inject([Router, Location], (router_: Router, location_: Location) => {
        router = router_;
        location = location_;
      }));

      describe('when requested file was not found', () => {

        it('should dispatch a Four0Four action', () => {
          setup_404ActionDispatch();
          const handleErrorSpy = spyOn(fileService, 'handleError').and.callThrough();
          const uiSpy = spyOn(uiActions, 'setFour0FourMessage');

          fileService.getFile('url').subscribe( (_)  => {},
            (error_)  => {}
          );

          expect(handleErrorSpy).toHaveBeenCalled();
          const expectedArgs = [ 'FileService.getFile', 'Caller: FileService.getFile, Response with status: 404 null for URL: some url. Error status: 404 }', 'some url' ];
          expect(uiSpy).toHaveBeenCalledWith(...expectedArgs);
        });

        it('should navigate to the 404 page', () => {
          setup_404ActionDispatch();
          const handleErrorSpy = spyOn(fileService, 'handleError').and.callThrough();
          const routerNavigateSpy = spyOn(router, 'navigate').and.callThrough();

          fileService.getFile('url').subscribe( (_)  => {},
            (error_)  => {}
          );

          expect(handleErrorSpy).toHaveBeenCalled();
          expect(routerNavigateSpy).toHaveBeenCalled();
        });
      });

      describe('when a non-404 error occurs', () => {
        it('should not dispatch a Four0Four action', () => {
          const error = new Error('some error');
          const uiSpy = spyOn(uiActions, 'setFour0FourMessage');
          mockBackend.connections.subscribe((conn: MockConnection) => {
            conn.mockError(error);
          });
          let subscribeErrorWasCalled = false;
          let errorCalled;

          fileService.getFile('url').subscribe(
            (_)  => {},
            (error_)  => {
              errorCalled = error_;
              subscribeErrorWasCalled = true;
            }
          );

          expect(subscribeErrorWasCalled).toBeTruthy();
          expect(uiSpy).not.toHaveBeenCalled();
          expect(errorCalled).toBe(error);
        });
      });
    });

  });

});
