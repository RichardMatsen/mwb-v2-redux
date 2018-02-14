import { Component, Input } from '@angular/core';

import { IMeasure } from '../model/measure.model';
import { ErrorBadgeComponent } from '../common/mw.common.module';
import { SparklineComponent } from '../graphs/sparkline/sparkline.component';

@Component( {
  selector: 'dashboard-thumbnail',
  template: `
      <div class="well well-sm hoverwell thumbnail">
        <div class="metric row">
          <a class="measure" [routerLink]="['/'+ measure.link ]" >
            <i class="measure-icon fa fa-lg" [ngClass]="measure?.icon" aria-hidden="true">
              <span class="title">{{measure.title}}</span>
            </i>
          </a>
          <div class="filler"></div>
          <sparkline [id]="measure.id" [history]="measure.history"></sparkline>
          <error-badge [item]="measure"></error-badge>
        </div>
        <div class="narrative row" *ngIf="measure.narrative">
          <div [id]="'narrtext_'+measure.id" class="narrative-text-container collapse">
            <hr/>
            <div class="narrative-text">{{measure.narrative}}</div>
          </div>
        </div>
        <a class="narrative-button" *ngIf="measure.narrative" 
          data-toggle="collapse" [attr.data-target]="'#narrtext_'+measure.id" 
          (click)="this.isExpanded = !this.isExpanded">
          <i class="narrative-icon fa" [ngClass]="{ 'fa-chevron-down': !isExpanded, 'fa-chevron-up': isExpanded }" aria-hidden="true"></i>
        </a>
      </div>
  `,
  styleUrls: ['dashboard-thumbnail.css', '../common/badge/badge.color.scheme.css']
})
export class DashboardThumbnailComponent {
  @Input() measure: IMeasure;
  private isExpanded = false;
}
