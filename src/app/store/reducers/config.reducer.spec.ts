import { Action } from 'redux';
import { configReducer } from './config.reducer';
import { ConfigActions } from '../../services/config/config.actions';
import { appInitialState } from '../state/AppState';
import { toHavePropertiesMatcher } from 'testing-helpers/jasmine-matchers/to-have-properties.matcher';
import { runAllReducerTests, ReducerTestConfig } from './generic.reducer.testing.hlpr';

describe('configReducer', () => {

  const mockNgReduxDispatcher = jasmine.createSpyObj('mockNgRedux', ['dispatch', 'getState']);
  const mockObjectShapeComparer = jasmine.createSpyObj('mockObjectShapeComparer', ['compare']);
  mockObjectShapeComparer.compare.and.returnValue([]);

  const actions = new ConfigActions(mockNgReduxDispatcher, mockObjectShapeComparer);
  const configInitialState = {...appInitialState.config};
  const page = {
    pageTitle: 'pageTitle',
    pageDescription: 'pageDescription',
    listTitle: 'listTitle',
    listWidth: 10,
    badgeUnits: 'units',
    resultsZoom: '50%'
  };
  const data = {
    baseDataUrl: 'baseDataUrl',
    validationsConfig: {
      filePrefixes: ['filePrefix'],
      numDataPointsForSparkline: 20,
      numInitialFilesToDisplay: 30,
      page
    },
    referentialsConfig: {
      filePrefixes: ['filePrefix'],
      daysToInitialize: 20,
      daysToDisplay: 30,
      page
    },
    clinicsConfig: {
      filePrefixes: ['filePrefix'],
      numDataPointsForSparkline: 20,
      numInitialFilesToDisplay: 30,
      page
    }
  };

  const tests: ReducerTestConfig[] = [
    {
      action: actions.createInitializeConfigRequest(),
      stateForReducer: configInitialState
    },
    {
      action: actions.createInitializeConfigSuccess(data),
      stateForReducer: configInitialState,
      payloadExpectedShape: actions.configTemplate
    },
    {
      action: actions.createInitializeConfigFailed(new Error('some error')),
      stateForReducer: configInitialState
    },
  ];

  runAllReducerTests(configReducer, tests);

});
