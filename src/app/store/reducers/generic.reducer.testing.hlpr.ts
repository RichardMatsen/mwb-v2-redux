import { deepClone } from '../util/deep-clone';
import { toHavePropertiesMatcher } from 'testing-helpers/jasmine-matchers/to-have-properties.matcher';
import { ObjectShapeComparer } from '../../common/object-shape-comparer/object-shape-comparer';

export interface ReducerTestConfig {
  action: object;
  stateForReducer: object;
  payloadExpectedShape?: object;
}

export function runAllReducerTests(reducer: Function, tests: ReducerTestConfig[]) {
  tests.forEach(({ action, stateForReducer, payloadExpectedShape }: ReducerTestConfig) => {
    runReducerTests(stateForReducer, reducer, action, payloadExpectedShape);
  });
}

export function runReducerTests(state, reducer, action, expectedShape= null) {

  describe(action.type, () => {

    beforeEach( () => {
      jasmine.addMatchers(toHavePropertiesMatcher);
    });

    let testState, cleanAction, priorStateSnapshot;
    beforeEach(() => {
      testState = deepClone(state);              // Ensure clean initialState for each test
      cleanAction = {...action};                 // Reset action before each, since action.type is changed in reducer
      priorStateSnapshot = deepClone(testState); // Snapshot the test state before each for comparison
    });

    it(`should return state unchanged for nop action`, () => {
      const nopAction = { type: 'NOP' };
      const result = reducer(testState, nopAction);
      expect(result).toBe(testState);
    });
    if (action.payload) {
      it(`should add payload to state`, () => {
        const afterState = reducer(testState, cleanAction);
        check_ActionWithPayload_ChangesState(priorStateSnapshot, afterState, cleanAction);
        check_ActionWithPayload_InputStateIsUnchanged(priorStateSnapshot, testState, action);
      });
      it(`should clone the state`, () => {
        const afterState = reducer(testState, cleanAction);
        check_ActionWithPayload_CreatesNewStateObject(testState, afterState, cleanAction);
      });
    }
    if (!action.payload) {
      it(`should not change state`, () => {
        const afterState = reducer(testState, cleanAction);
        check_ActionWithoutPayload_DoesNotChangeState(priorStateSnapshot, afterState, cleanAction);
      });
      it(`should not clone the state`, () => {
        const afterState = reducer(testState, cleanAction);
        check_ActionWithoutPayload_DoesNotCreateNewStateObject(testState, afterState, cleanAction);
      });
    }
    if (action.subState) {
      it(`should not affect other sub state`, () => {
        const afterState = reducer(testState, cleanAction);
        check_SubState_OtherStateIsUnchanged(testState, afterState, cleanAction);
      });
    }
    if (expectedShape) {
      it('should have payload in expected shape', () => {
        check_Payload_HasExpectedShape(action, expectedShape);
      });
    }
  });
}

function check_ActionWithPayload_ChangesState(priorStateSnapshot, afterState, action) {
  const priorSubStateSnapshot = resolveSubstate(priorStateSnapshot, action);
  const afterSubState = resolveSubstate(afterState, action);
  expect(afterSubState).toHaveProperties(action.payload);
  expect(priorSubStateSnapshot).not.toHaveProperties(afterSubState);  // Guard against false positive
}

function check_ActionWithPayload_InputStateIsUnchanged(priorStateSnapshot, inputState, action) {
  const inputSubState = resolveSubstate(inputState, action);
  const priorSubStateSnapshot = resolveSubstate(priorStateSnapshot, action);
  expect(inputState).toEqual(priorStateSnapshot);
  expect(inputSubState).toEqual(priorSubStateSnapshot);
}

function check_ActionWithPayload_CreatesNewStateObject(inputState, afterState, action) {
  const inputSubState = resolveSubstate(inputState, action);
  const afterSubState = resolveSubstate(afterState, action);
  expect(afterState).not.toBe(inputState);
  expect(afterSubState).not.toBe(inputSubState);
}

function check_ActionWithoutPayload_DoesNotChangeState(priorStateSnapshot, afterState, action) {
  const priorSubStateSnapshot = resolveSubstate(priorStateSnapshot, action);
  const afterSubState = resolveSubstate(afterState, action);
  expect(afterState).toEqual(priorStateSnapshot);
  expect(afterSubState).toEqual(priorSubStateSnapshot);
}

function check_ActionWithoutPayload_DoesNotCreateNewStateObject(inputState, afterState, action) {
  const inputSubState = resolveSubstate(inputState, action);
  const afterSubState = resolveSubstate(afterState, action);
  expect(afterState).toBe(inputState);
  expect(afterSubState).toBe(inputSubState);
}

function check_SubState_OtherStateIsUnchanged(inputState, afterState, action) {
  Object.keys(inputState)
    // tslint:disable-next-line:triple-equals
    .filter(key => key != action.subState)
    .forEach(key => {
      expect(afterState[key]).toBe(inputState[key]);
    });
}

function check_Payload_HasExpectedShape(action, expectedShape) {
  const objectShapeComparer = new ObjectShapeComparer();
  const shapeErrors = objectShapeComparer.compare(expectedShape, action.payload);
  expect(shapeErrors.length).toBe(0, shapeErrors);
}

function resolveSubstate(state, action) {
  return action.subState
    ? state[action.subState]
    : state;
}
