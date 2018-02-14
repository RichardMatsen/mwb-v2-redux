// tslint:disable:interface-over-type-literal

import { Action } from 'redux';
import { IAppState } from './AppState';
import { PageState } from './page.state';
import { UserState } from './user.state';
import { UiState } from './ui.state';
import { SearchState } from './search.state';

export type PageActionType = {
  type: string,
  payload?: PageState | Error,  // Constrain the payload properties to match those on state
  subState?: string,          // Reducer will act on named substate property only
  uiStartLoading?: string,    // Indicate to UiMiddleware to increment spinner counter
  uiEndLoading?: string,      // Indicate to UiMiddleware to decrement spinner counter
  toastr?: string,            // Indicate to UiMiddleware to emit toastr message
  typeModifier?: Function,    // Change the action type text in reducer (for clearer logging)
  excludeFromLog?: boolean,   // Devtools enhancer will filter this action from the log
};

export type UserActionType = {
  type: string,
  httpRequest?: HttpRequest,
  payload?: UserState,        // Constrain the payload properties to match those on state
};

export type UiActionType = {
  type: string,
  payload?: UiState,          // Constrain the payload properties to match those on state
  trigger?: string,           // Append to the action type to show what action triggered this action
  excludeFromLog?: boolean,   // Devtools enhancer will filter this action from the log
  message?: string,           // Message to display on the 404 screen
};

export type SearchActionType = {
  type: string,
  payload?: SearchState,      // Constrain the payload properties to match those on state
};

/*
  Map state handed to reducer into a sub-component, e.g
  for generic page components, the Page reducer needs to act on a single page
  but the actions are common to all pages, so we don't want to repeat the reducer
  for each individual page.
*/
export type ActionWithSubState = {
  type: string,
  subState?: string,
};

export type HttpRequest = {
  url: string,
  successAction: Function,
  failedAction: Function,
  // template?: string
  validateResponse?: Function
};

export type ActionWithHttpRequest = {
  type: string,
  request?: HttpRequest,
};
