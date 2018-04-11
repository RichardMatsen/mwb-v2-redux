/* tslint:disable:max-line-length */

import '../../rxjs-extensions';
import { Location, CommonModule } from '@angular/common';
import { TestBed, async, inject } from '@angular/core/testing';
import { RouterModule, Router, ActivatedRoute, Params, provideRoutes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions, Headers, RequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';
import { Observable } from 'rxjs/Observable';

import { FileService } from './file.service';
import { Logger, loggerFactory } from '../../common/mw.common.module';
import { subscribeAndExpectAllValues, subscribeAndExpectValue, subscribeAndExpectNoDataEmitted,
         DummyAppComponent, DummyTargetComponent, setupMockStore
       } from 'testing-helpers/testing-helpers.module.hlpr';

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
      ]
    }).compileComponents();
  });

  let fileService, mockBackend;
  beforeEach(
    inject([FileService, MockBackend], (fileService_, mockBackend_) => {
      fileService = fileService_;
      mockBackend = mockBackend_;
  }));

  it('should create the service', () => {
    expect(fileService).toBeTruthy();
  });

  describe('constructor dependencies', () => {

    let http, router, ngRedux, logger;
    beforeEach(
      inject([Http, Router, MockNgRedux, Logger], (http_, router_, ngRedux_, logger_) => {
        http = http_;
        router = router_;
        ngRedux = ngRedux_;
        logger = logger_;
    }));

    it('should inject dependencies', () => {
      // Ref: https://github.com/angular/angular-cli/issues/5871
      const fileService_ = new FileService(http, router, ngRedux, logger);
      expect(fileService_.http).toBeDefined('http');
      expect(fileService_.router).toBeDefined('router');
      expect(fileService_.ngRedux).toBeDefined('ngRedux');
      expect(fileService_.logger).toBeDefined('logger');
    });

  });

  const setup_404ActionDispatch = () => {
    const error = new Response(new ResponseOptions({status: 404, url: 'some url', body: 'some error'}));
    mockBackend.connections.subscribe((conn: MockConnection) => {
      // Ref: https://github.com/angular/angular/issues/7135 - double cast Response to Error
      conn.mockError(error as any as Error);
    });
  };

  const setup_MockDirectoryFile = (data) => {
    const file = data.join('\n');
    mockBackend.connections.subscribe((conn: MockConnection) => {
      conn.mockRespond(new Response(new ResponseOptions({ body: file })));
    });
  };

  describe('getFileList()', () => {

    describe('when http.get suceeds', () => {

      it('should return a list of file names', () => {
        const data = [ 'file1', 'file2', 'file3' ];
        setup_MockDirectoryFile(data);

        const sut$ = fileService.getFileList('some url', ['file']);
        subscribeAndExpectAllValues( sut$, data );
      });

      it('should only return those matching the prefix', () => {
        const data = [ 'file0', 'prefixedFile1', 'prefixedFile2', 'file3', 'prefixedFile4' ];
        setup_MockDirectoryFile(data);

        const sut$ = fileService.getFileList('url', 'prefixed');
        subscribeAndExpectAllValues( sut$, [ 'prefixedFile1', 'prefixedFile2', 'prefixedFile4' ]);
      });

      it('should return nothing when no files match prefix', () => {
        const data = [ 'file0', 'prefixedFile1', 'prefixedFile2', 'file3', 'prefixedFile4' ];
        setup_MockDirectoryFile(data);

        const sut$ = fileService.getFileList('url', 'willNotMatch');
        subscribeAndExpectAllValues( sut$, [ ] );
        subscribeAndExpectNoDataEmitted( sut$ );
      });

      it('should return nothing when there are no files at the requested location', () => {
        const data = [ ];
        setup_MockDirectoryFile(data);

        const sut$ = fileService.getFileList('url', 'prefix');
        subscribeAndExpectAllValues( sut$, data );
      });

    });

    describe('when http.get fails', () => {
      it('should dispatch a Four0Four action when http.get fails', () => {
        setup_404ActionDispatch();
        const handleErrorSpy = spyOn(fileService, 'handleError').and.callThrough();
        const dispatchSpy = spyOn(MockNgRedux.mockInstance, 'dispatch');

        fileService.getFileList('url').subscribe( (_)  => {},
          (error_)  => {}
        );

        expect(handleErrorSpy).toHaveBeenCalled();
        const expectedAction = { type: '[UI] FOUR0FOUR_MESSAGE', four0four: { caller: `FileService.getFileList`, url: 'some url' } };
        expect(dispatchSpy).toHaveBeenCalledWith(expectedAction);
      });
    });

  });

  describe('getFile()', () => {

    describe('when http.get suceeds', () => {
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
          const dispatchSpy = spyOn(MockNgRedux.mockInstance, 'dispatch');

          fileService.getFile('url').subscribe( (_)  => {},
            (error_)  => {}
          );

          expect(handleErrorSpy).toHaveBeenCalled();
          const expectedAction = { type: '[UI] FOUR0FOUR_MESSAGE', four0four: { caller: `FileService.getFile`, url: 'some url' } };
          expect(dispatchSpy).toHaveBeenCalledWith(expectedAction);
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
          const dispatchSpy = spyOn(MockNgRedux.mockInstance, 'dispatch');
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
          expect(dispatchSpy).not.toHaveBeenCalled();
          expect(errorCalled).toBe(error);
        });
      });
    });

  });

});
