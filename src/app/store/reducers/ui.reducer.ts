import { Action, Reducer } from 'redux';

const initialState = {
  activeRequests: 0
};

export const uiReducer: Reducer<any> = (state: any = initialState, action: any) => {
  switch (action.type) {

    case '[UI] INCREMENT_LOADING':
      action.type = qualifyActionType();
      return {...state, activeRequests: state.activeRequests + 1 };

    case '[UI] DECREMENT_LOADING':
      action.type = qualifyActionType();
      return state.activeRequests > 0
        ? {...state, activeRequests: state.activeRequests - 1 }
        : state;

    case '[UI] FOUR0FOUR_MESSAGE':
      action.type = qualifyActionType();
      return {...state, four0four: action.payload.four0four };

    default:
      return state;
  }

  function qualifyActionType() {
    return action.type + ' / ' + (action.trigger ? action.trigger.toLowerCase() : '');
  }

};
