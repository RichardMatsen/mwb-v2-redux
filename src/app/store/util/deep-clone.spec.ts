import { deepClone } from './deep-clone';

describe('deepClone', () => {

  it('should handle primitives', () => {
    const state = 1;
    const clone = deepClone(state);
    expect(clone).toEqual(state);
  });

  it('should clone simple objects', () => {
    const state = { x: 1, y: 'abc' };
    const clone = deepClone(state);
    expect(clone).toEqual(state);
    expect(clone).not.toBe(state);
  });

  it('should clone nested objects', () => {
    const state = { obj1: { x: 1, y: 'abc' }, obj2: { x: 2, y: 'def' } };
    const clone = deepClone(state);

    expect(clone).toEqual(state);
    expect(clone.obj1).toEqual(state.obj1);
    expect(clone.obj2).toEqual(state.obj2);

    expect(clone).not.toBe(state);
    expect(clone.obj1).not.toBe(state.obj1);
    expect(clone.obj2).not.toBe(state.obj2);
  });

  it('should clone arrays', () => {
    const state = [1, 'abc', 2, 'def'];
    const clone = deepClone(state);

    expect(clone).toEqual(state);
    expect(clone).not.toBe(state);
  });

  it('should clone object with array property', () => {
    const state = { num1: 1, string1: 'xyz', array1: [1, 'abc', 2, 'def'] };
    const clone = deepClone(state);

    expect(clone).toEqual(state);
    expect(clone.array1[0]).toEqual(state.array1[0]);
    expect(clone.array1[1]).toEqual(state.array1[1]);
    expect(clone).not.toBe(state);
    expect(clone.array1).not.toBe(state.array1);
  });

  it('should clone array of objects', () => {
    const state = { array1: [{ x: 1, y: 'abc' }, { x: 2, y: 'def' }] };
    const clone = deepClone(state);

    expect(clone).toEqual(state);
    expect(clone.array1[0]).toEqual(state.array1[0]);
    expect(clone.array1[1]).toEqual(state.array1[1]);
    expect(clone).not.toBe(state);
    expect(clone.array1[0]).not.toBe(state.array1[0]);
    expect(clone.array1[1]).not.toBe(state.array1[1]);
  });

});
