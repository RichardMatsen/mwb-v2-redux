import { Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';

import { IAppState } from '../store/state/AppState';
import { IUser } from '../model/user.model';
import { ifNull } from '../store/selector-helpers/selector-helpers';
import { UserActionType } from '../store/state/action-types';

@Injectable()
export class UserActions {

  static INITIALIZE_USERS_REQUEST = 'INITIALIZE_USERS_REQUEST';
  static INITIALIZE_USERS_SUCCESS = 'INITIALIZE_USERS_SUCCESS';
  static INITIALIZE_USERS_FAILED = 'INITIALIZE_USERS_FAILED';
  static SET_CURRENT_USER = 'SET_CURRENT_USER';
  static UPDATE_CURRENT_USER = 'UPDATE_CURRENT_USER';
  static ACTIONS = [UserActions.INITIALIZE_USERS_REQUEST,
                    UserActions.INITIALIZE_USERS_SUCCESS,
                    UserActions.INITIALIZE_USERS_FAILED,
                    UserActions.SET_CURRENT_USER,
                    UserActions.UPDATE_CURRENT_USER];

  @select('users') users$: Observable<IUser[]>;

  constructor(
    private ngRedux: NgRedux<IAppState>,
  ) {}

  createInitializeUsersRequest(): UserActionType {
    return {
      type: UserActions.INITIALIZE_USERS_REQUEST,
      httpRequest: {
        url: 'api/users',
        successAction: this.createInitializeUsersSuccess,
        failedAction: this.createInitializeUsersFailed,
      }
    };
  };
  initializeUsersRequest() {
    this.ngRedux.dispatch(this.createInitializeUsersRequest());
  }

  createInitializeUsersSuccess(response): UserActionType {
    console.log(response)
    return {
      type: UserActions.INITIALIZE_USERS_SUCCESS,
      payload: {
        users: [...response.data]  // InMemoryDbService adds additional data property
      }
    };
  };
  initializeUsersSuccess(response) {
    this.ngRedux.dispatch(this.createInitializeUsersSuccess(response));
  }

  createInitializeUsersFailed(error): UserActionType {
    return {
      type: UserActions.INITIALIZE_USERS_FAILED,
      payload: {
        error
      }
    };
  };
  initializeUsersFailed(error) {
    this.ngRedux.dispatch(this.createInitializeUsersFailed(error));
  }

  createSetCurrentUser(user: IUser): UserActionType {
    return {
      type: UserActions.SET_CURRENT_USER,
      payload: {
        currentUser: user
      }
    };
  }
  setCurrentUser(user: IUser) {
    this.ngRedux.dispatch(this.createSetCurrentUser(user));
  }

  createUpdateCurrentUser(firstName: string, lastName: string): UserActionType {
    const newCurrentUser = Object.assign({}, this.ngRedux.getState().user.currentUser);
    newCurrentUser.firstName = firstName;
    newCurrentUser.lastName = lastName;
    return {
      type: UserActions.UPDATE_CURRENT_USER,
      payload: {
        currentUser: newCurrentUser
      }
    };
  }
  updateCurrentUser(firstName: string, lastName: string) {
    this.ngRedux.dispatch(this.createUpdateCurrentUser(firstName, lastName));
  }

}
