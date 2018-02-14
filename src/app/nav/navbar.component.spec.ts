import '../rxjs-extensions';
import { Location, CommonModule } from '@angular/common';
import { TestBed, async, inject } from '@angular/core/testing';
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';
import { DummyAppComponent, DummyTargetComponent, setupMockStore } from 'testing-helpers/testing-helpers.module.hlpr';
import { NavBarComponent, isAuthenticatedSelector } from './navbar.component';

describe('navbar.component', () => {

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
        NavBarComponent,
      ],
      providers: [
        MockNgRedux,
        NavBarComponent,
      ]
    }).compileComponents();
  });

  let navBarComponent, router;
  beforeEach(
    inject([NavBarComponent, Router], (navBarComponent_, router_) => {
      navBarComponent = navBarComponent_;
      router = router_;
    })
  );

  describe('isAuthenticatedSelector()', () => {

    it('should return false if currentUser is not set', () => {
      const state = { user: { currentUser: null } };
      const result = isAuthenticatedSelector(state);
      expect(result).toBe(false);
    });

    it('should return true if currentUser is set', () => {
      const state = { user: { currentUser: 'JJones' } };
      const result = isAuthenticatedSelector(state);
      expect(result).toBe(true);
    });

  });

  describe('navigation events', () => {

    it('should respond tp router events', () => {
      const event = new NavigationStart(1, 'some url');
      const spy = spyOn(navBarComponent, 'toggleSpinner');
      router.events.next(event);
      expect(spy).toHaveBeenCalled();
    });

    it('should set loading true for NavigationStart', () => {
      const event = new NavigationStart(1, 'some url');
      navBarComponent.toggleSpinner(event);
      expect(navBarComponent.loading).toBe(true);
    });

    it('should set loading false for NavigationEnd', () => {
      const event = new NavigationEnd(1, 'some url', 'redirects');
      navBarComponent.toggleSpinner(event);
      expect(navBarComponent.loading).toBe(false);
    });

    it('should set loading false for NavigationError', () => {
      const event = new NavigationError(1, 'some url', 'error');
      navBarComponent.toggleSpinner(event);
      expect(navBarComponent.loading).toBe(false);
    });

    it('should set loading false for NavigationCancel', () => {
      const event = new NavigationCancel(1, 'some url', 'reason');
      navBarComponent.toggleSpinner(event);
      expect(navBarComponent.loading).toBe(false);
    });

  });

});
