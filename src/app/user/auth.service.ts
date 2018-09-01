import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { select } from 'app/store/store.service';
import { IUser } from '../model/user.model';
import { UserActions } from '../store/actions/user.actions';
import { waitforFirstNotNull } from 'app/store/selector-helpers/selector-helpers';

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
        localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
      }
    });
  }

  checkLocalStorage() {
    try {  // user may not be permitted to use localStorage
      const storedCurrentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (storedCurrentUser) {
        this.userActions.setCurrentUser(storedCurrentUser);
        return true;
      }
    } catch {
    }
    return false;
  }
}
