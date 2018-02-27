import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfigActions } from './services/config/config.actions';
import { AuthguardService } from './nav/authguard.service';
import { Http, Response, ResponseOptions } from '@angular/http';

@Component({
  selector: 'mwb-root',
  template: `
  <div class="container-fluid">
    <mwb-nav-bar></mwb-nav-bar>
    <router-outlet  id="bgimage"></router-outlet>
    <mwb-spinner></mwb-spinner>
  </div>
  `,
  providers: [
    ConfigActions,
 ],
})
export class AppComponent implements OnInit {
  title = 'Migration Workbench';

  constructor(
    private configActions: ConfigActions,
    private authGuardService: AuthguardService,
    private http: Http,
  ) {}

  ngOnInit() {
    this.configActions.initializeConfigRequest();
  }

}
