import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { select } from 'app/store/store.service';
import { IUser } from '../model/user.model';

export function isAuthenticatedSelector(state) {
  return state.user.currentUser !== null;
}

@Component({
  selector: 'mwb-nav-bar',
  templateUrl: 'navbar.component.html',
  styles: [`
    li > a.active { color: #F97924 }
    nav { margin-bottom: 0 },
  `
  ]
})
export class NavBarComponent implements OnInit, OnDestroy {

  public isCollapsed = true;
  loading = false;
  version = 'v 2.0.0';
  userPrompt = 'try to login';

  @select(['user', 'currentUser']) currentUser$: Observable<IUser>;

  // Valid in dev, will not compile in aot
  // @select((state) => state.user.currentUser !== null) isAuthenticated$: Observable<boolean>;
  @select(isAuthenticatedSelector) isAuthenticated$: Observable<boolean>;

  private routerSubscription: Subscription;

  constructor(
    private router: Router,
  ) {}

  ngOnInit() {
    this.routerSubscription = this.router.events.subscribe((event: RouterEvent) => {
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

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
