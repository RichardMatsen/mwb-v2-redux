import '../../rxjs-extensions';
import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions, ResponseType, Headers, RequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';

import { UiActions } from '../../common/ui-actions/ui.actions';
import { ConfigActions } from '../../services/config/config.actions';
import { HttpMiddleware } from '../middleware/http.middleware';
import { DummyAppComponent, DummyTargetComponent, setupMockStore,
         MockError, MockResponse } from 'testing-helpers/testing-helpers.module.hlpr';
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

  let calls = 0, urlCalled = '', uiActions, middleware, subscription;

  beforeEach(() => {
    calls = 0;
    urlCalled = '';
    middleware = httpMiddleware.httpMiddlewareFactory();
    uiActions = TestBed.get(UiActions);
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });

  describe('when action does not have httpRequest property', () => {

    it('should pass the action on to next', () => {
      const action = { type: 'NOP'};
      // const middleware = httpMiddleware.httpMiddlewareFactory();

      middleware(mockStore)(mockNext)(action);
      expect(mockNext).toHaveBeenCalledWith(action);
    });

    it('should not call http.get', () => {
      const action = { type: 'NOP'};
      // const middleware = httpMiddleware.httpMiddlewareFactory();

      // let calls = 0;
      subscription = mockBackend.connections.subscribe((connection) => { calls++; });

      middleware(mockStore)(mockNext)(action);
      expect(calls).toBe(0);
    });
  });

  describe('when action has httpRequest property', () => {

    it('should pass the action on to next', () => {
      const action = { type: 'NOP'};

      middleware(mockStore)(mockNext)(action);
      expect(mockNext).toHaveBeenCalledWith(action);
    });

    it('should call http.get', () => {
      const action = { type: 'NOP', httpRequest: { url: 'some url' }};

      subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
        urlCalled = connection.request.url;
        calls++;
      });

      middleware(mockStore)(mockNext)(action);
      expect(calls).toBe(1);
      expect(urlCalled).toBe('some url');
    });

    it('should increment loading counter', () => {
      const action = {
        type: 'NOP',
        httpRequest: {
          url: 'some url',
          successAction: () => {calls++; }
        }
      };

      const options = { body: [{}, {}], status: 200 };
      subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
        urlCalled = connection.request.url;
        const responseOptions = new ResponseOptions(options);
        const response = new Response(responseOptions);
        connection.mockRespond(response);
      });
      const spy = spyOn(uiActions, 'incrementLoading');

      middleware(mockStore)(mockNext)(action);
      expect(spy).toHaveBeenCalledWith('NOP');
    });

  });

  describe(' when http.get succeeds', () => {

    it('should call successAction', () => {
      const action = {
        type: 'NOP',
        httpRequest: {
          url: 'some url',
          successAction: () => {calls++; }
        }
      };

      const spy = spyOn(action.httpRequest, 'successAction');

      const options = { body: [{}, {}], status: 200 };
      subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
        urlCalled = connection.request.url;
        const responseOptions = new ResponseOptions(options);
        const response = new Response(responseOptions);
        connection.mockRespond(response);
      });

      middleware(mockStore)(mockNext)(action);
      expect(spy).toHaveBeenCalledWith(options.body);
    });

    it('should decrement loading counter', () => {
      const action = {
        type: 'NOP',
        httpRequest: {
          url: 'some url',
          successAction: () => {calls++; }
        }
      };

      const options = { body: [{}, {}], status: 200 };
      subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
        urlCalled = connection.request.url;
        const responseOptions = new ResponseOptions(options);
        const response = new Response(responseOptions);
        connection.mockRespond(response);
      });
      const spy = spyOn(uiActions, 'decrementLoading');

      middleware(mockStore)(mockNext)(action);
      expect(spy).toHaveBeenCalledWith('NOP');
    });

  });

  describe(' when http.get fails', () => {

    it('should call failedAction', () => {
      const action = {
        type: 'NOP',
        httpRequest: {
          url: 'some url',
          failedAction: () => {calls++; }
        }
      };

      const error = new Error('some error');
      subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
        urlCalled = connection.request.url;
        connection.mockError(error);
      });
      const spy = spyOn(action.httpRequest, 'failedAction');

      middleware(mockStore)(mockNext)(action);
      expect(spy).toHaveBeenCalledWith(error);
    });

    it('should set 404 message when http status is 404', () => {
      const action = {
        type: 'NOP',
        httpRequest: {
          url: 'some url',
          failedAction: () => {calls++; },
          four0FourMessage: 'this was not found'
        }
      };

      subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockError(new MockError(404));
      });
      const spy = spyOn(uiActions, 'setFour0FourMessage');

      middleware(mockStore)(mockNext)(action);
      expect(spy).toHaveBeenCalledWith('Action type: NOP', 'this was not found', 'some url');
    });

    it('should decrement loading counter', () => {
      const action = {
        type: 'NOP',
        httpRequest: {
          url: 'some url',
          failedAction: () => {calls++; },
        }
      };

      subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockError(new MockError(404));
      });
      const spy = spyOn(uiActions, 'decrementLoading');

      middleware(mockStore)(mockNext)(action);
      expect(spy).toHaveBeenCalledWith('NOP');
    });

  });

  describe(' when action has a validator', () => {

    it('should validate response', () => {
      const action = configActions.createInitializeConfigRequest();

      subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
        const response = new Response(new ResponseOptions({ body: {}, status: 200 }));
        connection.mockRespond(response);
      });
      const spy = spyOn(action.httpRequest, 'failedAction');

      middleware(mockStore)(mockNext)(action);
      expect(spy).toHaveBeenCalledWith(new Error(httpMiddleware.invalidDataMessage));
    });

  });
});
