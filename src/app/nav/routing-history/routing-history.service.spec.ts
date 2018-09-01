import { Location, CommonModule } from '@angular/common';
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, async, inject } from '@angular/core/testing';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';
import { DummyAppComponent, DummyTargetComponent, setupMockStore } from 'testing-helpers/testing-helpers.module.hlpr';

import { RoutingHistory } from './routing-history.service';

describe('routing-history.service', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'test', component: DummyTargetComponent }
        ]),
        CommonModule,
        NgReduxTestingModule,
      ],
      declarations: [
        DummyTargetComponent,
      ],
      providers: [
        MockNgRedux,
      ]
    }).compileComponents();
  });

  let router, routingHistory;
  beforeEach(
    inject([Router], (router_) => {
      router = router_;
    })
  );
  beforeEach(() => {
    routingHistory = new RoutingHistory(router);
    routingHistory.loadRouting();
  });
  afterEach(() => {
    routingHistory.ngOnDestroy();
  });

  describe('lastNavigationUrl()', () => {
    it('should return the last url seen by router', () => {
      const event = new NavigationEnd(1, 'some url', 'redirects');
      router.events.next(event);
      expect(routingHistory.lastNavigationUrl).toEqual('"some url"');
    });
  });

  describe('ngOnDestroy()', () => {
    it('should end routing events subscription', () => {
      const event = new NavigationEnd(1, 'some url', 'redirects');
      router.events.next(event);
      routingHistory.ngOnDestroy();
      expect(routingHistory.routerSubscription.closed).toEqual(true);
    });
  });

});
