import { Component } from '@angular/core';
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

// Place me last on the page to overlay page content.

@Component({
  selector: 'navigation-spinner',
  template: `
    <div class="loading-overlay" *ngIf="loading">
      <i class="center-fix main-spinner fa fa-spin fa-spinner"></i>
    </div>
  `,
  styles: ['i.fa-spin { font-size: 128px; font-weight: bold; position: absolute; top: 190px; left: 50%; color: #db3813; }']
})
export class NavigationSpinnerComponent {
  loading = true;

  constructor(private router: Router) {
    router.events.subscribe((event: RouterEvent) => {
      this.loading = !(event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError );
    });
  }

}
