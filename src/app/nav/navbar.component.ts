import { Component } from '@angular/core';
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';

import { IUser } from '../model/user.model';

export function isAuthenticatedSelector(state) {
  return state.user.currentUser !== null;
};

@Component({
  selector: 'mwb-nav-bar',
  templateUrl: 'navbar.component.html',
  styles: [`
    li > a.active { color: #F97924 }
    nav { margin-bottom: 0 },
  `
  ]
})
export class NavBarComponent {

  public isCollapsed = true;
  loading = true;
  version = 'v 2.0.0';

  @select(['user', 'currentUser']) currentUser$: Observable<IUser>;

  // Valid in dev, will not compile in aot
  // @select((state) => state.user.currentUser !== null) isAuthenticated$: Observable<boolean>;
  @select(isAuthenticatedSelector) isAuthenticated$: Observable<boolean>;

  constructor(
    private router: Router,
  ) {
    router.events.subscribe((event: RouterEvent) => {
      this.toggleSpinner(event);
    });
  }

  toggleSpinner(event: RouterEvent) {
    this.loading = !(
      event instanceof NavigationEnd ||
      event instanceof NavigationCancel ||
      event instanceof NavigationError
    );
  }

}
