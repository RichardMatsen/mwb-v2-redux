import { Component } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';

// Place me last on the page to overlay page content.

@Component({
  selector: 'mwb-spinner',
  template: `
    <div class="loading-overlay" *ngIf="(activeRequests$ | async) > 0">
      <i class="center-fix main-spinner fa fa-spin fa-spinner"></i>
    </div>
  `,
  styles: [`
    i.fa-spin {
      font-size: 128px;
      font-weight: bold;
      position: absolute;
      top: 190px;
      left: 50%;
      color: #db3813;
    }
  `]
})
export class SpinnerComponent {
  @select(['ui', 'activeRequests']) activeRequests$: number;
}
