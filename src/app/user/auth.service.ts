import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select } from '@angular-redux/store';

import { IUser } from '../model/user.model';
import { UserActions } from './user.actions';
import { waitforFirstNotNull } from '../store/selector-helpers/selector-helpers';

@Injectable()
export class AuthService {

  @select(['user', 'users']) users$: Observable<IUser[]>;
  @select(['user', 'currentUser']) currentUser$: Observable<IUser>;

  constructor (
    private userActions: UserActions,
  ) {}

  loginUser(name: string, password: string) {
    waitforFirstNotNull(this.users$, (users: IUser[]) => {
      const userIndex = users.map(user => user.userName).indexOf(name);
      if (userIndex > -1) {
        this.userActions.setCurrentUser(users[userIndex]);
      }
    });
  }
}
