import { UserState } from '../state/user.state';

export interface HttpRequest {
  url: string;
  successAction: Function;
  validateResponse?: Function;
  failedAction: Function;
  four0FourMessage?: string;
}

export interface UserActionType {
  type: string;
  httpRequest?: HttpRequest;
  payload?: UserState;        // Constrain the payload properties to match those on state
}
