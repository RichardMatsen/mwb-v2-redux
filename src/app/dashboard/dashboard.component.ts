import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { select } from 'app/store/store.service';

import { IMeasure } from 'app/model/measure.model';
import { StyleWithLess } from 'app/common/mw.common.module';
import { MeasureService } from './measure.service';

@StyleWithLess({
    'mat-card': {
      marginTop: '1em',
      'div.dashboard': {
        paddingLeft: '.8em',
        'h1': {
          marginTop: '10px',
          fontSize: '2.5em'
        },
      },
    }
})
@Component({
  selector: 'mwb-dashboard',
  template: `
  <mat-card>
    <div class="dashboard container-fluid">
      <h1 class="page-title">Dashboard</h1>
      <span class="subtitle">Summary of errors, load failures, clinic matching, team tasks</span>
      <hr class="titles-rule"/>
      <div class="thumbnails row">
        <div *ngFor="let measure of measures$ | async" class="dashboard col-md-8 col-md-offset-2">
          <mwb-dashboard-thumbnail [measure]="measure"></mwb-dashboard-thumbnail>
        </div>
      </div>
    </div>
  </mat-card>
  `,
  // STANDARD ANGULAR STYLES DECLARATION - replaced by LESS format above
  // styles: [
  //   'mat-card { margin-top: .8em; }',
  //   'div.dashboard { padding-left: .8em; }',
  //   'div.dashboard h1 { margin-top: 10px; font-size: 2.5em }',
  //   ]
})
export class DashboardComponent implements OnInit {

  @select('measures') measures$: Observable<IMeasure[]>;

  constructor(
    private measureService: MeasureService
  ) {}

  ngOnInit() {
    this.measureService.initializeMeasures();
    this.measureService.updateMeasures();
  }
}
