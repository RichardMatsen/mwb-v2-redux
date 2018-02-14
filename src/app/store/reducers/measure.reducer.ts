import { Action, Reducer } from 'redux';
import { IMeasure } from '../../model/measure.model';
import { MeasureActions } from '../../dashboard/measure.actions';

const initialState: IMeasure[] = [];

const errorMeasures = [{ 'id': 'err', 'title': 'Error loading measures', 'icon': 'fa-exclamation-triangle', 'link': '' }];

export const measureReducer: Reducer<IMeasure[]> = (state: IMeasure[] = initialState, action: Action) => {
  switch (action.type) {
    case MeasureActions.INITIALIZE_MEASURES_SUCCESS:
    case MeasureActions.INITIALIZE_MEASURES_FAILED:
      return initializeMeasures(state, action);
    case MeasureActions.UPDATE_MEASURE:
      return updateMeasure(state, action);
    default:
      return state;
  }
};

function initializeMeasures(state, action): IMeasure[] {
  action.type = '[MEASURES] ' + action.type;
  return action.payload.measures;
}

function updateMeasure(state, action): IMeasure[] {
  const newState = [...state];
  const index = newState.findIndex(m => m.id === action.payload.measureUpdate.id );
  if (index > -1) {
    const newMeasure = {...newState[index]};
    newMeasure.metric = action.payload.measureUpdate.metric;
    newMeasure.color = action.payload.measureUpdate.color;
    newMeasure.history = action.payload.measureUpdate.history;
    newState[index] = newMeasure;
    action.type = '[MEASURES] ' + action.type + ' / ' + newMeasure.id;
  }
  return newState;
}
