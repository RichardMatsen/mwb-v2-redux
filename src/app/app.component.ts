import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Http, Response, ResponseOptions } from '@angular/http';

import { AuthguardService } from 'app/nav/authguard.service';
import { AuthService } from 'app/user/auth.service';
import { ConfigActions } from 'app/store/actions/config.actions';

@Component({
  selector: 'mwb-root',
  template: `
  <div class="container-fluid">
    <mwb-nav-bar></mwb-nav-bar>
    <router-outlet id="bgimage"></router-outlet>
    <mwb-spinner></mwb-spinner>
  </div>
  `,
  providers: [
    ConfigActions,
    AuthService
 ],
})
export class AppComponent implements OnInit {
  title = 'Migration Workbench';

  constructor(
    private configActions: ConfigActions,
    private authGuardService: AuthguardService,
    private http: Http,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.configActions.initializeConfigRequest();
    this.authService.checkLocalStorage();
  }

}
