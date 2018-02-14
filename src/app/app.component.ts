import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfigActions } from './services/config/config.actions';
import { AuthguardService } from './nav/authguard.service';
import { Http, Response, ResponseOptions } from '@angular/http';

@Component({
  selector: 'app-root',
  template: `
  <div class="container-fluid">
    <nav-bar></nav-bar>
    <router-outlet  id="bgimage"></router-outlet>
    <spinner></spinner>
  </div>
  `,
  // styles: [`
  //   #bgimage {
  //     background: url('./src/assets/s3.jpg') no-repeat center;
  //     background-size: cover;
  //   }
  // '],
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
