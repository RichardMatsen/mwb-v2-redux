// tslint:disable:interface-over-type-literal

import { IUser } from 'app/model/user.model';

export type UserState = {
  currentUser?: IUser,
  users?: IUser[],
  error?: any
};

export const userInitialState: UserState = {
  currentUser: null,
  users: null,
};
