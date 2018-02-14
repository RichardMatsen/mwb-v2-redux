import { deepClone } from '../util/deep-clone';
import { toHavePropertiesMatcher } from 'testing-helpers/jasmine-matchers/to-have-properties.matcher';
import { ObjectShapeComparer } from '../../common/object-shape-comparer/object-shape-comparer';

export function runReducerTests(initialState, reducer, action, expectedShape= null) {

  describe(action.type, () => {

    beforeEach( () => {
      jasmine.addMatchers(toHavePropertiesMatcher);
    });

    let testState, cleanAction, priorStateSnapshot;
    beforeEach(() => {
      testState = deepClone(initialState);       // Ensure clean initialState for each test
      cleanAction = {...action};                 // Reset action before each, since action.type is changed in reducer
      priorStateSnapshot = deepClone(testState); // Snapshot the test state before each for comparison
    });

    it(`should return state unchanged for nop action`, () => {
      const nopAction = { type: 'NOP' };
      const result = reducer(testState, nopAction);
      expect(result).toBe(testState);
    });

    it(`should add payload to state`, () => {
      const afterState = reducer(testState, cleanAction);
      check_ActionWithPayload_ChangesState(priorStateSnapshot, afterState, cleanAction);
      check_ActionWithPayload_InputStateIsUnchanged(priorStateSnapshot, testState, action);
      check_ActionWithoutPayload_DoesNotChangeState(priorStateSnapshot, afterState, cleanAction);
    });
    it(`should clone the state`, () => {
      const afterState = reducer(testState, cleanAction);
      check_ActionWithPayload_CreatesNewStateObject(testState, afterState, cleanAction);
      check_ActionWithoutPayload_DoesNotCreateNewStateObject(testState, afterState, cleanAction);
    });
    it(`should not affect other sub state`, () => {
      const afterState = reducer(testState, cleanAction);
      check_SubState_OtherStateIsUnchanged(testState, afterState, cleanAction);
    });
    it('should have payload in expected shape', () => {
      if (expectedShape) {
        check_Payload_HasExpectedShape(action, expectedShape);
      }
    });
  });
}

function check_ActionWithPayload_ChangesState(priorStateSnapshot, afterState, action) {
  if (!!action.payload) {
    const priorSubStateSnapshot = resolveSubstate(priorStateSnapshot, action);
    const afterSubState = resolveSubstate(afterState, action);
    expect(afterSubState).toHaveProperties(action.payload);
    expect(priorSubStateSnapshot).not.toHaveProperties(afterSubState);  // Guard against false positive
  }
}

function check_ActionWithPayload_InputStateIsUnchanged(priorStateSnapshot, inputState, action) {
  if (!!action.payload) {
    const inputSubState = resolveSubstate(inputState, action);
    const priorSubStateSnapshot = resolveSubstate(priorStateSnapshot, action);
    expect(inputState).toEqual(priorStateSnapshot);
    expect(inputSubState).toEqual(priorSubStateSnapshot);
  }
}

function check_ActionWithPayload_CreatesNewStateObject(inputState, afterState, action) {
  if (!!action.payload) {
    const inputSubState = resolveSubstate(inputState, action);
    const afterSubState = resolveSubstate(afterState, action);
    expect(afterState).not.toBe(inputState);
    expect(afterSubState).not.toBe(inputSubState);
  }
}

function check_ActionWithoutPayload_DoesNotChangeState(priorStateSnapshot, afterState, action) {
  if (!action.payload) {
    const priorSubStateSnapshot = resolveSubstate(priorStateSnapshot, action);
    const afterSubState = resolveSubstate(afterState, action);
    expect(afterState).toEqual(priorStateSnapshot);
    expect(afterSubState).toEqual(priorSubStateSnapshot);
  }
}

function check_ActionWithoutPayload_DoesNotCreateNewStateObject(inputState, afterState, action) {
  if (!action.payload) {
    const inputSubState = resolveSubstate(inputState, action);
    const afterSubState = resolveSubstate(afterState, action);
    expect(afterState).toBe(inputState);
    expect(afterSubState).toBe(inputSubState);
  }
}

function check_SubState_OtherStateIsUnchanged(inputState, afterState, action) {
  if (!action.subState) {
    return;
  }
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
  expect(shapeErrors.length).toBe(0);
}

function resolveSubstate(state, action) {
  return action.subState
    ? state[action.subState]
    : state;
}
