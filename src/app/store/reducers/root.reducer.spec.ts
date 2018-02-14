import { rootReducer } from './root.reducer';
import { IAppState, appInitialState } from '../state/AppState';

describe('Reducer', () => {

  it('should have the correct initial state', () => {
    const state = rootReducer(appInitialState, {type: 'nop'});
    expect(state.config).toEqual(appInitialState.config);
    expect(state.measures).toBe(appInitialState.measures);
    expect(state.pages).toEqual(appInitialState.pages);
    expect(state.ui).toEqual(appInitialState.ui);
    expect(state.user).toEqual(appInitialState.user);
    expect(state.search).toEqual(appInitialState.search);
  });

});
