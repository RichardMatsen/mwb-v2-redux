import { ConfigActions } from './config.actions';
import { ObjectShapeComparer } from 'app/common/object-shape-comparer/object-shape-comparer';

describe('ConfigActions', () => {

  let mockNgReduxDispatcher, mockObjectShapeComparer, configActions;

  beforeEach( () => {
    mockNgReduxDispatcher = jasmine.createSpyObj('mockNgRedux', ['dispatch']);
    mockObjectShapeComparer = jasmine.createSpyObj('mockObjectShapeComparer', ['compare']);
    configActions = new ConfigActions(mockNgReduxDispatcher, mockObjectShapeComparer);
  });

  it('should create the service', () => {
    expect(!!configActions).toBeTruthy();
  });

  it('should create templates', () => {
    // configActions.ngOnInit();
    expect(configActions.pageConfigTemplate).toBeTruthy();
    expect(configActions.configTemplate).toBeTruthy();
  });

  it('should create initializeConfigRequest action', () => {
    const action = configActions.createInitializeConfigRequest();
    expect(action.type).toEqual(ConfigActions.INITIALIZE_CONFIG_REQUEST);
  });

  it('should dispatch initializeConfigRequest', () => {
    configActions.initializeConfigRequest();
    expect(mockNgReduxDispatcher.dispatch).toHaveBeenCalled();  // Leave this general as config may change frequently
  });

  it('should create initializeConfigSuccess action', () => {
    const action = configActions.createInitializeConfigSuccess();
    expect(action.type).toEqual(ConfigActions.INITIALIZE_CONFIG_SUCCESS);
  });

  it('should create initializeConfigFailed action', () => {
    const action = configActions.createInitializeConfigFailed();
    expect(action.type).toEqual(ConfigActions.INITIALIZE_CONFIG_FAILED);
  });

  describe('checkTemplate', () => {

    it('should check loaded config against template', () => {
      const data = {};
      mockObjectShapeComparer.compare.and.returnValue([]);
      const validation = configActions.checkTemplate(data);
      expect(validation).toBeTruthy();
    });

    it('should fail template check when data is invalid', () => {
      const data = {};
      mockObjectShapeComparer.compare.and.returnValue(['failed this']);
      const validation = configActions.checkTemplate(data);
      expect(validation).toBeFalsy();
    });

    it('should dispatch INITIALIZE_CONFIG_TEMPLATE_ERROR when template check fails', () => {
      const data = {};
      mockObjectShapeComparer.compare.and.returnValue(['failed this', 'failed that']);
      const validation = configActions.checkTemplate(data);
      expect(mockNgReduxDispatcher.dispatch).toHaveBeenCalledTimes(2);
    });

  });

});
