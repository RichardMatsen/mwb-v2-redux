import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MaterialModule } from '@angular/material';
import { InMemoryWebApiModule, InMemoryBackendConfigArgs } from 'angular-in-memory-web-api';

import { userRoutes } from './user.routes';
import { UserActions } from 'app/store/actions/user.actions';
import { ProfileComponent } from './profile.component';
import { LoginComponent } from './login.component';
import { AuthService } from './auth.service';
import { ToastrService } from 'app/common/toastr/toastr.service';
import { InMemUsersService } from 'app/services/in-memory-db/in-memory-db';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(userRoutes),
    FormsModule,
    ReactiveFormsModule,
    // MaterialModule,
    HttpModule,
    InMemoryWebApiModule.forRoot(InMemUsersService, {
      delay: 500,
      passThruUnknownUrl: true
    }),
  ],
  exports: [
    LoginComponent,
  ],
  declarations: [
    ProfileComponent,
    LoginComponent
  ],
  providers: [
    UserActions,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: UserModule,
      providers: [
        UserActions,
        AuthService,
        ToastrService
      ]
    };
  }
}
