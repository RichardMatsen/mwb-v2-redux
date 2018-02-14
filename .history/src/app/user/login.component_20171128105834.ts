import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';

import { AuthService } from './auth.service';
import { IUser } from '../model/user.model';
import { UserActions } from './user.actions';
import { ifNull } from '../store/selector-helpers/selector-helpers';

@Component({
  templateUrl: 'login.component.html',
  styles: [` 
    em { float: right; color: #E05C65; padding-left: 10px; }
    mat-card-content { height: 300px }
  `]
})
export class LoginComponent implements OnInit {

  @select(['user', 'users']) users$: Observable<IUser[]>;
  public mouseoverLogin: boolean;
  public userName: string;
  public password: string;

  returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private userActions: UserActions,
  ) {}

  ngOnInit() {
    ifNull(this.users$, () => {
      console.log('fetching users')
      this.userActions.initializeUsersRequest();
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login(formValues) {
    this.authService.loginUser(formValues.userName, formValues.password);
    this.router.navigateByUrl(this.returnUrl);
  }

  cancel() {
    this.router.navigate(['/']);
  }

  // select(formValues, user) {
  select(user) {
    this.userName = user.lastName;
  }
}
