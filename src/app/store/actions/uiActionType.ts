import { UiState } from '../state/ui.state';

// export type UiActionType = {
//   type: string,
//   payload?: UiState,          // Constrain the payload properties to match those on state
//   trigger?: string,           // Append to the action type to show what action triggered this action
//   excludeFromLog?: boolean,   // Devtools enhancer will filter this action from the log
//   message?: string,           // Message to display on the 404 screen
// };

export interface UiActionType {
  type: string;
  payload?: UiState;
  triggeringAction?: string;
  excludeFromLog?: boolean;
  four0FourMessage?: string;
}
