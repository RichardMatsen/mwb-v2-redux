import './rxjs-extensions';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { MatCardModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { LocalStorageModule } from 'angular-2-local-storage';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgReduxModule, NgRedux } from '@angular-redux/store';
// import { ResponsiveModule } from 'ng2-responsive';

// import * as cloudinary from 'cloudinary-core/cloudinary-core-shrinkwrap';
// import {CloudinaryModule, CloudinaryConfiguration, provideCloudinary} from '@cloudinary/angular-4.x';

import { AppComponent } from './app.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { LinqpadPagesModule } from './linqpad-review-pages/linqpad-pages.module';
import { StoreModule } from './store/store.module';
import { UserModule } from './user/user.module';
import { NavModule } from './nav/nav.module';
import { MigrationWorkBenchCommonModule, Logger, loggerFactory, SpinnerComponent } from './common/mw.common.module';
import { AppRoutingModule } from './app-routing.module';
import { TasksModule } from './tasks/tasks.module';
import { SharedDataService } from './services/shared-data.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    LocalStorageModule.withConfig({
      prefix: 'migwb',
      storageType: 'localStorage'
    }),
    // MaterialModule,
    MatCardModule,
    ModalModule.forRoot(),
    NgReduxModule,
    // ResponsiveModule,
    // CloudinaryModule.forRoot(cloudinary,
    //   {
    //     cloud_name: 'ccloudd'
    //   } as CloudinaryConfiguration),

    DashboardModule,
    LinqpadPagesModule,
    MigrationWorkBenchCommonModule,
    UserModule.forRoot(),
    StoreModule,
    NavModule,
    AppRoutingModule,
    TasksModule,
  ],
  exports: [
    MatCardModule
  ],
  declarations: [
    AppComponent,
    // MatCard,
  ],
  providers: [
    { provide: Logger, useFactory: loggerFactory },
    SharedDataService,
 ],
  bootstrap: [AppComponent]
})
export class AppModule {}
