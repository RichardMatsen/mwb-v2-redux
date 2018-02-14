import { Action } from 'redux';
import { IMeasure, IMeasureUpdate } from '../../model/measure.model';
import { measureReducer } from './measure.reducer';
import { MeasureActions } from '../../dashboard/measure.actions';
import { MeasureState, measureInitialState } from '../state/measure.state';
import { toHavePropertiesMatcher } from 'testing-helpers/jasmine-matchers/to-have-properties.matcher';
import { runReducerTests } from './generic.reducer.testing.hlpr';

describe('measureReducer', () => {

  const measures: IMeasure[] = [
    {id: '1', title: 'title1', metric: '1', color: 'green', icon: '', link: ''},
    {id: '2', title: 'title2', metric: '2', color: 'purple', icon: '', link: ''}
  ];
  const errorMessage = 'some error';
  const measureUpdate: IMeasureUpdate = { id: '1', metric: '3', color: 'orange' };

  const mockNgReduxDispatcher = jasmine.createSpyObj('mockNgRedux', ['dispatch', 'getState']);
  const actions = new MeasureActions(mockNgReduxDispatcher);

  describe('MeasureActions.INITIALIZE_MEASURES_SUCCESS', () => {
    it('should set state to payload.measures', () => {
      const testState = {...measureInitialState};
      const action = actions.createInitializeMeasuresSuccess(measures);
      const afterState = measureReducer(testState, action);
      expect(action.type).toEqual('[MEASURES] INITIALIZE_MEASURES_SUCCESS');
      expect(afterState).toEqual(measures);
    });
  });

  describe('MeasureActions.INITIALIZE_MEASURES_ERROR', () => {
    it('should set state to payload.error', () => {
      const testState = {...measureInitialState};
      const action = actions.createInitializeMeasuresFailed(errorMessage);
      const afterState = measureReducer(testState, action);
      expect(action.type).toEqual('[MEASURES] INITIALIZE_MEASURES_FAILED');
      expect(afterState).toEqual([{ id: 'err', title: `Error loading measures: ${errorMessage}`, icon: 'fa-exclamation-triangle' }]);
    });
  });

  describe('MeasureActions.UPDATE_MEASURE', () => {
    it('should update the measure with id equal to action id', () => {
      const testState = measures;
      const action = actions.createUpdateMeasure(measureUpdate);
      const afterState = measureReducer(testState, action);
      expect(action.type).toEqual('[MEASURES] UPDATE_MEASURE / 1');
      const expected = {...measures[0], ...{ metric: measureUpdate.metric, color: measureUpdate.color, history: undefined}};
      expect(afterState[0]).toEqual(expected);
      expect(afterState[1]).toBe(measures[1]);
    });
  });

});
