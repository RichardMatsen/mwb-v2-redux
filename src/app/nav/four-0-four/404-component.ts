import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { RoutingHistory } from 'app/nav/routing-history/routing-history.service';

import { select } from 'app/store/store.service';

@Component({
 template: `
    <div class="container">
      <h1 class="errorMessage">404'd</h1>
      <hr/>
      <h4 *ngIf="(caller$ | async)"> Caller: {{ caller$ | async }}</h4>
      <h4 *ngIf="(message$ | async)"> Message: {{ message$ | async }}</h4>
      <h4 *ngIf="(url$ | async)"> Url: {{ url$ | async }}</h4>
      <h4 *ngIf="(methodArgs$ | async)"> Method args: {{ methodArgs$ | async }}</h4>
      <h4 *ngIf="route"> Route: {{ routingHistory.lastNavigationUrl }}</h4>
    </div>
  `,
  styles: [`
    .errorMessage {
      margin-top:150px;
      font-size: 170px;
      text-align: center;
    }`]
})
export class Error404PageComponent {

  @select(['ui', 'four0four', 'caller']) caller$: Observable<string>;
  @select(['ui', 'four0four', 'message']) message$: Observable<string>;
  @select(['ui', 'four0four', 'url']) url$: Observable<string>;
  @select(['ui', 'four0four', 'methodArgs']) methodArgs$: Observable<string>;

  constructor(
    public route: ActivatedRoute,
    public routingHistory: RoutingHistory
  ) {}

}
