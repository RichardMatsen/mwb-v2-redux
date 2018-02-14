import { Component } from '@angular/core';
import { Location, CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { RouterModule, Router, ActivatedRoute, Params, provideRoutes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, async, inject, ComponentFixture } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';

import { DashboardComponent } from './dashboard.component';
import { DashboardThumbnailComponent } from './dashboard-thumbnail';
import { MeasureService } from './measure.service';
import { ErrorBadgeComponent } from '../common/mw.common.module';
import { DummyAppComponent, DummyTargetComponent, setupMockStore } from 'testing-helpers/testing-helpers.module.hlpr';
import { SparklineComponent } from '../graphs/sparkline/sparkline.component';

const measureData = {
  measures: [
    {title: 'tester1', metric: '95%', icon: '', color: 'purple', link: 'someLink1'},
    {title: 'tester2', metric: '85%', icon: '', color: 'magenta', link: 'someLink2'},
  ]
};
const stub1 = setupMockStore(['measures'], measureData.measures );

describe('DashboardComponent', () => {

  let fixture: ComponentFixture<DashboardComponent>,
    dashboardComponent: DashboardComponent,
    mockMeasureService;

  beforeEach( () => {
    mockMeasureService = jasmine.createSpyObj('mockActions', ['initializeMeasures', 'updateMeasures']);

    TestBed.configureTestingModule({
      imports: [
        // http://stackoverflow.com/questions/39577920/angular-2-unit-testing-components-with-routerlink
        CommonModule,
        RouterTestingModule.withRoutes([
          { path: 'someLink1', component: DummyTargetComponent },
          { path: 'someLink2', component: DummyTargetComponent }
        ]),
        MatCardModule,
        NgReduxTestingModule,
      ],
      declarations: [
        DummyAppComponent,       // for router-outlet
        DashboardComponent,
        DashboardThumbnailComponent,
        ErrorBadgeComponent,
        DummyTargetComponent,
        SparklineComponent,
      ],
      providers: [
        { provide: MeasureService, useValue: mockMeasureService },
      ]
    });
    TestBed.compileComponents();
    const appComponent = TestBed.createComponent(DummyAppComponent);
    fixture = TestBed.createComponent(DashboardComponent);
    dashboardComponent = fixture.componentInstance;
  });

  it('should create the component', async(() => {
    expect(dashboardComponent).toBeTruthy();
  }));

  it('should get all measures', async(() => {
    let flag = false;
    dashboardComponent.ngOnInit();
    dashboardComponent.measures$
      .subscribe(measures => {
        flag = true;
        expect(measures.length).toEqual(2);
        expect(measures[0].color).toEqual('purple');
        expect(measures[1].color).toEqual('magenta');
      });
    expect(flag).toBeTruthy();
  }));

  describe('thumbnails', () => {

    let router, location;
    beforeEach(inject([Router, Location], (router_: Router, location_: Location) => {
      router = router_;
      location = location_;
    }));

    it('should have thumbnails', () => {
      fixture.detectChanges();
      const thumbnails = fixture.debugElement.queryAll(By.directive(DashboardThumbnailComponent));
      expect(thumbnails.length).toEqual(2);
      expect(thumbnails[0].componentInstance.measure.color).toEqual('purple');
      expect(thumbnails[1].componentInstance.measure.color).toEqual('magenta');
    });

    it('thumbnails should navigate', (done) => {
      fixture.detectChanges();
      const thumbnails = fixture.debugElement.queryAll(By.directive(DashboardThumbnailComponent));
      expect(thumbnails.length).toEqual(2);
      thumbnails[0].query(By.css('a')).nativeElement.click();

      fixture.whenStable().then(() => {
        expect(location.path()).toEqual('/someLink1');
        done();
      });
    });

  });
});
