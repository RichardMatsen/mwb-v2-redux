import { SearchState } from '../state/search.state';

export interface SearchActionType {
  type: string;
  payload?: SearchState;      // Constrain the payload properties to match those on state
}
