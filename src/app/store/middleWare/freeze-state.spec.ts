import '../../rxjs-extensions';
import { freezeState, deepFreeze } from './freeze-state';

describe('freezeState', () => {

  const state = { x: 1 };
  const mockStore = jasmine.createSpyObj('mockStore', ['dispatch', 'getState']);
  mockStore.getState.and.returnValue(state);
  const mockNext = jasmine.createSpy('next');

  const action = { type: 'NOP' };

  it('should freeze state', () => {
    freezeState(mockStore)(mockNext)(action);
    // tslint:disable-next-line:quotemark
    expect(() => { state.x = 2; }).toThrow( new TypeError("Cannot assign to read only property 'x' of object '[object Object]'"));
  });

  it('should call next', () => {
    freezeState(mockStore)(mockNext)(action);
    expect(mockNext).toHaveBeenCalled();
  });

});

describe('deepFreeze()', () => {

  it('should handle primitives', () => {
    const state = 1;
    const clone = deepFreeze(state);
    expect(clone).toEqual(state);
  });

  it('should freeze simple objects', () => {
    const state = { x: 1, y: 'abc' };
    const frozen = deepFreeze(state);
    expect(() => {frozen.x = 2; }).toThrowError(TypeError);
    expect(() => {frozen.y = 'def'; }).toThrowError(TypeError);
  });

  it('should freeze nested objects', () => {
    const state = { obj1: { x: 1, y: 'abc' }, obj2: { x: 2, y: 'def' } };
    const frozen = deepFreeze(state);
    expect(() => {frozen.obj1.x = 2; }).toThrowError(TypeError);
    expect(() => {frozen.obj1.y = 'def'; }).toThrowError(TypeError);
    expect(() => {frozen.obj1 = { x: 3, y: 'ghi'}; }).toThrowError(TypeError);
    expect(() => {frozen.obj2.x = 3; }).toThrowError(TypeError);
    expect(() => {frozen.obj2.y = 'ghi'; }).toThrowError(TypeError);
    expect(() => {frozen.obj2 = { x: 3, y: 'ghi'}; }).toThrowError(TypeError);
  });

  it('should freeze arrays', () => {
    const state = [1, 'abc', 2, 'def'];
    const frozen = deepFreeze(state);
    expect(() => {frozen[0] = 2; }).toThrowError(TypeError);
    expect(() => {frozen[1] = 'def'; }).toThrowError(TypeError);
    expect(() => {frozen[2] = 3; }).toThrowError(TypeError);
    expect(() => {frozen[3] = 'ghi'; }).toThrowError(TypeError);
  });

  it('should freeze object with array property', () => {
    const state = { num1: 1, string1: 'xyz', array1: [1, 'abc', 2, 'def'] };
    const frozen = deepFreeze(state);
    expect(() => {frozen.num1 = 2; }).toThrowError(TypeError);
    expect(() => {frozen.string1 = 'abc'; }).toThrowError(TypeError);
    expect(() => {frozen.array1 = [2, 'def', 3]; }).toThrowError(TypeError);
    expect(() => {frozen.array1[0] = 2; }).toThrowError(TypeError);
    expect(() => {frozen.array1[1] = 'def'; }).toThrowError(TypeError);
    expect(() => {frozen.array1[2] = 3; }).toThrowError(TypeError);
  });

  it('should freeze array of objects', () => {
    const state = { array1: [{ x: 1, y: 'abc' }, { x: 2, y: 'def' }] };
    const frozen = deepFreeze(state);
    expect(() => { frozen.array1 = [{x: 2, y: 'def'}, {x: 3, y: 'ghi'}]; }).toThrowError(TypeError);
    expect(() => { frozen.array1[0] = {x: 2, y: 'def'}; }).toThrowError(TypeError);
    expect(() => { frozen.array1[1] = {x: 3, y: 'ghi'}; }).toThrowError(TypeError);
  });

});
