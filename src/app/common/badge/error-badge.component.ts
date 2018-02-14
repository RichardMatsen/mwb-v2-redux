import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'error-badge',
  template: `
    <span class="badge pull-right" *ngIf="item?.metric != null" [ngClass]="item?.badgeColor || item?.color" >
      {{item?.metric}} {{units}}
    </span>
  `,
  styleUrls: ['./badge.color.scheme.css', './error-badge.component.css'],
})
export class ErrorBadgeComponent  {
  @Input() item: any;
  @Input() units = '';
}
