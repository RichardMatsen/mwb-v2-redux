import { IMeasure } from 'app/model/measure.model';
import { PageState, PageStateRoot, pagesInitialState } from '../state/page.state';
import { SearchState, searchInitialState } from '../state/search.state';
import { UserState, userInitialState } from '../state/user.state';
import { UiState, uiInitialState } from '../state/ui.state';
import { MeasureState, measureInitialState } from '../state/measure.state';
import { FileState, fileInitialState } from '../state/file.state';

export interface IAppState {
  config?: any;
  measures?: MeasureState;
  pages?: PageStateRoot;
  ui: UiState;
  search: SearchState;
  user: UserState;
  file: FileState;
}

export const appInitialState: IAppState = {
  config: {},
  measures: measureInitialState,
  pages: pagesInitialState,
  ui: uiInitialState,
  search: searchInitialState,
  user: userInitialState,
  file: fileInitialState
};
