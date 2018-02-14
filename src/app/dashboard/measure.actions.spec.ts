import { MeasureActions } from './measure.actions';

describe('DashboardActions', () => {

  let mockNgReduxDispatcher, measureActions;

  beforeEach( () => {
    mockNgReduxDispatcher = jasmine.createSpyObj('mockNgRedux', ['dispatch']);
    measureActions = new MeasureActions(mockNgReduxDispatcher);
  });

  it('should create the service', () => {
    expect(!!measureActions).toBeTruthy();
  });

  it('should dispatch initializeMeasuresRequest', () => {
    // const measures = {id: 'testMeasure', metric: '99', color: 'red'};
    measureActions.initializeMeasuresRequest();
    expect(mockNgReduxDispatcher.dispatch).toHaveBeenCalledWith({
      type: MeasureActions.INITIALIZE_MEASURES_REQUEST,
      uiStartLoading: MeasureActions.INITIALIZE_MEASURES_REQUEST,
      excludeFromLog: true
     });
  });

  it('should dispatch initializeMeasuresSuccess', () => {
    const measures = {id: 'testMeasure', metric: '99', color: 'red'};
    measureActions.initializeMeasuresSuccess(measures);
    expect(mockNgReduxDispatcher.dispatch).toHaveBeenCalledWith({
      type: MeasureActions.INITIALIZE_MEASURES_SUCCESS,
      uiEndLoading: MeasureActions.INITIALIZE_MEASURES_SUCCESS,
      payload: { measures },
     });
  });

  it('should dispatch initializeMeasuresError', () => {
    const error = new Error('error for test');
    measureActions.initializeMeasuresFailed(error);
    expect(mockNgReduxDispatcher.dispatch).toHaveBeenCalledWith({
      type: MeasureActions.INITIALIZE_MEASURES_FAILED,
      uiEndLoading: MeasureActions.INITIALIZE_MEASURES_FAILED,
      payload: { measures: [measureActions.errorMeasure(error)] }
    });
  });

  it('should dispatch updateMeasure', () => {
    const measureUpdate =  {id: 'testMeasure', metric: '99', color: 'red'};
    measureActions.updateMeasure(measureUpdate);
    expect(mockNgReduxDispatcher.dispatch).toHaveBeenCalledWith({
      type: MeasureActions.UPDATE_MEASURE,
      payload: {
        measureUpdate
      }
    });
  });

});
