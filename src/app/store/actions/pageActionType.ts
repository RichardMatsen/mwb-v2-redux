import { PageState } from '../state/page.state';

export interface PageActionType {
  type: string;
  payload?: PageState | Error;  // Constrain the payload properties to match those on state
  subState: string;            // Reducer will act on named substate property only
  uiStartLoading?: string;     // Indicate to UiMiddleware to increment spinner counter
  uiEndLoading?: string;       // Indicate to UiMiddleware to decrement spinner counter
  toastr?: string;             // Indicate to UiMiddleware to emit toastr message
  typeModifier?: Function;     // Change the action type text in reducer (for clearer logging)
  excludeFromLog?: boolean;    // Devtools enhancer will filter this action from the log
}
