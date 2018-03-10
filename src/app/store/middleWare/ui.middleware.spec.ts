import '../../rxjs-extensions';
import { TestBed, async, inject } from '@angular/core/testing';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';

import { UiActions } from '../../common/ui-actions/ui.actions';
import { UiMiddleware } from '../middleware/ui.middleware';
import { ToastrService } from '../../common/mw.common.module';

describe('uiMiddleware', () => {

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        NgReduxTestingModule,
      ],
      providers: [
        UiActions,
        UiMiddleware,
        ToastrService,
      ]
    }).compileComponents();
  });

  const mockStore = jasmine.createSpyObj('mockStore', ['dispatch', 'getState']);
  const mockNext = jasmine.createSpy('next');

  let uiMiddleware, uiActions, toastr;
  beforeEach(
    inject([UiMiddleware, UiActions, ToastrService], (uiMiddleware_, uiActions_, toastr_) => {
      uiMiddleware = uiMiddleware_;
      uiActions = uiActions_;
      toastr = toastr_;
    })
  );

  describe('when action has uiStartLoading property', () => {
    it('should call uiActions.incementLoading()', () => {
      const action = { type: 'NOP', uiStartLoading: 'test action' };
      const middleware = uiMiddleware.uiMiddlewareFactory();
      const spy = spyOn(uiActions, 'incrementLoading');

      middleware(mockStore)(mockNext)(action);
      expect(spy).toHaveBeenCalledWith('test action');
    });
  });

  describe('when action has uiEndLoading property', () => {
    it('should call uiActions.decrementLoading()', () => {
      const action = { type: 'NOP', uiEndLoading: 'test action' };
      const middleware = uiMiddleware.uiMiddlewareFactory();
      const spy = spyOn(uiActions, 'decrementLoading');

      middleware(mockStore)(mockNext)(action);
      expect(spy).toHaveBeenCalledWith('test action');
    });
  });

  describe('when action has toastr property', () => {
    it('should call toastr.info()', () => {
      const action = { type: 'NOP', toastr: 'test message' };
      const middleware = uiMiddleware.uiMiddlewareFactory();
      const spy = spyOn(toastr, 'info');

      middleware(mockStore)(mockNext)(action);
      expect(spy).toHaveBeenCalledWith('test message');
    });
  });

});
