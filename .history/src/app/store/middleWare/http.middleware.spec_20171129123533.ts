import '../../rxjs-extensions';
import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions, ResponseType, Headers, RequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';

import { UiActions } from '../../common/ui-actions/ui-actions';
import { ConfigActions } from '../../services/config/config.actions';
import { HttpMiddleware } from '../middleware/http.middleware';
import { DummyAppComponent, DummyTargetComponent, setupMockStore } from 'testing-helpers/testing-helpers.module.hlpr';
import { ObjectShapeComparer } from '../../common/object-shape-comparer/object-shape-comparer';

describe('httpMiddleware', () => {

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        RouterTestingModule.withRoutes([
          { path: 'testPath', component: DummyTargetComponent }
        ]),
        NgReduxTestingModule,
      ],
      declarations: [
        DummyTargetComponent,
      ],
      providers: [
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        },
        UiActions,
        ObjectShapeComparer,
        ConfigActions,
        HttpMiddleware,
      ]
    }).compileComponents();
  });

  const mockStore = jasmine.createSpyObj('mockNgRedux', ['dispatch', 'getState']);
  const mockNext = jasmine.createSpy('next');

  let httpMiddleware, mockBackend, configActions;
  beforeEach(
    inject([HttpMiddleware, MockBackend, Http, ConfigActions], (httpMiddleware_, mockBackend_, http_, configActions_) => {
      httpMiddleware = httpMiddleware_;
      mockBackend = mockBackend_;
      configActions = configActions_;
    })
  );

  describe('when action does not have httpRequest property', () => {

    it('should pass the action on to next', () => {
      const action = { type: 'NOP'};
      const middleware = httpMiddleware.httpMiddlewareFactory();

      middleware(mockStore)(mockNext)(action);
      expect(mockNext).toHaveBeenCalledWith(action);
    });

    it('should not call http.get', () => {
      const action = { type: 'NOP'};
      const middleware = httpMiddleware.httpMiddlewareFactory();

      let calls = 0;
      mockBackend.connections.subscribe((connection) => { calls++; });

      middleware(mockStore)(mockNext)(action);
      expect(calls).toBe(0);
    });
  });

  describe('when action has httpRequest property', () => {

    it('should pass the action on to next', () => {
      const action = { type: 'NOP'};
      const middleware = httpMiddleware.httpMiddlewareFactory();

      middleware(mockStore)(mockNext)(action);
      expect(mockNext).toHaveBeenCalledWith(action);
    });

    it('should call http.get', () => {
      const action = { type: 'NOP', httpRequest: { url: 'some url' }};
      const middleware = httpMiddleware.httpMiddlewareFactory();

      let calls = 0, urlCalled = '';
      mockBackend.connections.subscribe((connection: MockConnection) => {
        urlCalled = connection.request.url;
        calls++;
      });

      middleware(mockStore)(mockNext)(action);
      expect(calls).toBe(1);
      expect(urlCalled).toBe('some url');
    });

    it('should call successAction when http.get succeeds', () => {
      let calls = 0, urlCalled = '';
      const action = { type: 'NOP', httpRequest: { url: 'some url', successAction: () => {calls++; } }};
      const middleware = httpMiddleware.httpMiddlewareFactory();

      const spy = spyOn(action.httpRequest, 'successAction');

      const options = { body: [{}, {}], status: 200 };
      mockBackend.connections.subscribe((connection: MockConnection) => {
        urlCalled = connection.request.url;
        const responseOptions = new ResponseOptions(options);
        const response = new Response(responseOptions);
        connection.mockRespond(response);
      });

      middleware(mockStore)(mockNext)(action);
      expect(spy).toHaveBeenCalledWith(options.body);
    });

    it('should call failedAction when http.get fails', () => {
      let calls = 0, urlCalled = '';
      const action = { type: 'NOP', httpRequest: { url: 'some url', failedAction: () => {calls++; } }};
      const middleware = httpMiddleware.httpMiddlewareFactory();

      const error = new Error('some error');
      mockBackend.connections.subscribe((connection: MockConnection) => {
        urlCalled = connection.request.url;
        connection.mockError(error);
      });
      const spy = spyOn(action.httpRequest, 'failedAction');

      middleware(mockStore)(mockNext)(action);
      expect(spy).toHaveBeenCalledWith(error);
    });

    it('should validate response when action has a validator', () => {
      // configActions.ngOnInit();
      const action = configActions.createInitializeConfigRequest();
      const middleware = httpMiddleware.httpMiddlewareFactory();

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const response = new Response(new ResponseOptions({ body: {}, status: 200 }));
        connection.mockRespond(response);
      });
      const spy = spyOn(action.httpRequest, 'failedAction');

      middleware(mockStore)(mockNext)(action);
      expect(spy).toHaveBeenCalledWith(new Error(httpMiddleware.invalidDataMessage));
    });

  });

});
