import { Component, Directive } from '@angular/core';
import { TestBed, async, inject, getTestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Location, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { By } from '@angular/platform-browser';
import { NgRedux, select, } from '@angular-redux/store';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';

import { AppComponent } from './app.component';
import { NavBarComponent } from './nav/navbar.component';
import { AuthService } from './user/auth.service';
import { APP_BASE_HREF } from '@angular/common';
import { MigrationWorkBenchCommonModule } from './common/mw.common.module';
import { ConfigActions } from './services/config/config.actions';
import { DashboardModule } from './dashboard/dashboard.module';
import { AppRoutingModule } from './app-routing.module';

@Component({
  template: ''
})
class DummyComponent {
}

describe('AppComponent', () => {

  let mockSearchService, mockAuthService;

  beforeEach(() => {
    mockSearchService = jasmine.createSpyObj('mockSearchService', ['search']);
    mockAuthService = jasmine.createSpyObj('mockAuthService', ['loginUser', 'isAuthenticated', 'updateCurrentUser']);

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        // http://stackoverflow.com/questions/39577920/angular-2-unit-testing-components-with-routerlink
        CommonModule,                                         // import the CommonModule from @angular/common for *ngFor
        RouterTestingModule.withRoutes([                      // use the RouterTestingModule from @angular/router/testing,
          { path: 'dashboard', component: DummyComponent }      // where you can set up some mock routes.
        ]),
        NgReduxTestingModule,
        DashboardModule,
        AppRoutingModule,
        MigrationWorkBenchCommonModule,
      ],
      declarations: [
        AppComponent,
        NavBarComponent,
        DummyComponent,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: APP_BASE_HREF, useValue: '/' },
        ConfigActions,
      ],
      // http://stackoverflow.com/questions/35975879/angular2-test-how-do-i-mock-sub-component
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
      // If you use schemas: [CUSTOM_ELEMENTS_SCHEMA]in TestBed the component under test will not load sub components.
      // schemas: [NO_ERRORS_SCHEMA]
      // also
      // https://github.com/cnunciato/ng2-mock-component
    })
    .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Migration Workbench'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Migration Workbench');
  }));

  describe('navbar', () => {
    it('should render the nav bar', async(() => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('nav-bar')).toBeTruthy();
      expect(compiled.querySelector('.navbar-brand').textContent).toContain('Migration Workbench');
    }));
  });

});
