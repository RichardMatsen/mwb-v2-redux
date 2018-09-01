import 'app/rxjs-extensions';
import { Injectable, OnDestroy } from '@angular/core';
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { filter } from 'rxjs/operators/filter';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class RoutingHistory implements OnDestroy {
  public history: NavigationEnd[] = [];
  routerSubscription: Subscription;

  public get lastNavigationUrl() {
    return this.history.length
      ? `"${this.history[this.history.length - 1].url.replace(/%20/g, ' ')}"`
      : '';
  }
  constructor(
    private router: Router
  ) {}

  public loadRouting(): void {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((navEnd: NavigationEnd) => {
        this.history = [...this.history, navEnd];
      });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
