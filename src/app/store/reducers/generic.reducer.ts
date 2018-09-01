import { Action, Reducer } from 'redux';
import { ActionWithSubState } from '../actionTypes/actionWithSubState';

// tslint:disable-next-line:interface-over-type-literal
export type reducerFactoryConfig = {
  initialState: any,
  handledActions: string[],
  actionQualifierConfig: any
};

export class GenericReducerFactory {

  createReducer<T>(config: reducerFactoryConfig): Reducer<T> {

    const actionQualifier =
        typeof config.actionQualifierConfig === 'string' ? (action) => `[${config.actionQualifierConfig}] ${action.type}`
      : typeof config.actionQualifierConfig === 'function' ? (action) => config.actionQualifierConfig(action)
      : (action) => action.type;

    const genericReducer = (state: T = config.initialState, action: Action) => {
      if (config.handledActions.indexOf(action.type) === -1) {
        return state;
      }
      const newState = this.genericActionHandler(state, action);
      action.type = actionQualifier(action);
      return newState;
    };
    return genericReducer;
  }

  genericActionHandler(state, action) {
    if (!action.payload) {
      return state;
    }
    const newState = {...state};
    const subState = this.resolveSubstate(newState, action);
    Object.assign(subState, action.payload);
    return newState;
  }

  private resolveSubstate(newState, action) {
    let subState;
    if (action.subState) {
      subState = {...newState[action.subState]};
      newState[action.subState] = subState;
    } else {
      subState = newState;
    }
    return subState;
  }

}
