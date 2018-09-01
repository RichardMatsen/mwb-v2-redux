import { UiState } from '../state/ui.state';

export interface UiActionType {
  type: string;
  payload?: UiState;
  triggeringAction?: string;
  excludeFromLog?: boolean;
  four0FourMessage?: string;
}
