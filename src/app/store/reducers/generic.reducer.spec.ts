import { GenericReducerFactory, reducerFactoryConfig } from './generic.reducer';

describe('genericReducerFactory', () => {

  const factory = new GenericReducerFactory();

  it('should return a reducer function', () => {
    const config: reducerFactoryConfig = { actionQualifierConfig: null, handledActions: ['ACTION1', 'ACTION2'], initialState: {} };
    const reducer = factory.createReducer(config);
    expect(typeof reducer).toBe('function');
  });

  describe('genericReducer', () => {

    describe('action handling', () => {

      it('should handle known actions', () => {
        const config: reducerFactoryConfig = {
          actionQualifierConfig: null,
          handledActions: ['ACTION1', 'ACTION2'],
          initialState: { x: 'state original' }
        };
        const reducer = factory.createReducer(config);
        const action = { type: 'ACTION1', payload: { x: 'state change' } };
        const spy = spyOn(factory, 'genericActionHandler').and.callThrough();

        const result = reducer({}, action);
        expect(spy).toHaveBeenCalled();
        expect(result).toEqual({ x: 'state change' });
      });

      it('should handle return unmodified state for unknown actions', () => {
        const config: reducerFactoryConfig = {
          actionQualifierConfig: null,
          handledActions: ['ACTION1', 'ACTION2'],
          initialState: { x: 'state original' }
        };
        const reducer = factory.createReducer(config);
        const action = { type: 'ACTION3', payload: { x: 'state change' } };
        const spy = spyOn(factory, 'genericActionHandler').and.callThrough();

        const result = reducer(undefined, action);
        expect(spy).not.toHaveBeenCalled();
        expect(result).toEqual({ x: 'state original' });
      });

    });

    describe('action type qualifyer', () => {

      it('should prefix type when qualifier is a string', () => {
        const config: reducerFactoryConfig = {
          actionQualifierConfig: 'TEST',
          handledActions: ['ACTION1', 'ACTION2'],
          initialState: { x: 'state original' }
        };
        const reducer = factory.createReducer(config);
        const action = { type: 'ACTION1', payload: { x: 'state change' } };

        const result = reducer({}, action);
        expect(action.type).toEqual('[TEST] ACTION1');
      });

      it('should map type when qualifier is a function', () => {
        const config: reducerFactoryConfig = {
          actionQualifierConfig: (action) => `[TEST] ${action.type} | test1`,
          handledActions: ['ACTION1', 'ACTION2'],
          initialState: { x: 'state original' }
        };
        const reducer = factory.createReducer(config);
        const action = { type: 'ACTION1', payload: { x: 'state change' } };

        const result = reducer({}, action);
        expect(action.type).toEqual('[TEST] ACTION1 | test1');
      });

      it('should leave action type unchanged when qualifier is null', () => {
        const config: reducerFactoryConfig = {
          actionQualifierConfig: null,
          handledActions: ['ACTION1', 'ACTION2'],
          initialState: { x: 'state original' }
        };
        const reducer = factory.createReducer(config);
        const action = { type: 'ACTION1', payload: { x: 'state change' } };

        const result = reducer({}, action);
        expect(action.type).toEqual('ACTION1');
      });

    });

  });

});
