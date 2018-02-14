import '../../app/rxjs-extensions';
import { Observable } from 'rxjs/Observable';
import { subscribeAndExpectAllValues, subscribeAndTestAllValues,
         subscribeAndExpectValue, subscribeAndTestValue,
         subscribeAndExpectNoDataEmitted, subscribeAndTestNoDataEmitted,
         arraysEqual } from './subscribeAndExpect.hlpr';

const observableArray = Observable.from([1, 2, 3]);
const observableSingle = Observable.of(1);
const observableEmpty = Observable.empty();
const observableNull = Observable.of(null);
const observableThrow = Observable.throw(new Error('error!'));

describe('subscribeAndExpectAllValues', () => {

  it('should pass with correct expected list', () => {
    subscribeAndExpectAllValues(observableArray, [1, 2, 3]);
  });

  it('should fail with incorrect expected list', () => {
    const result = subscribeAndTestAllValues(observableArray, [1, 2]);
    expect(result).toBe('Subscription results do not match expected array');
  });

  it('should fail with empty expected list', () => {
    const result = subscribeAndTestAllValues(observableArray, []);
    expect(result).toBe('Subscription results do not match expected array');
  });

  it('should fail when observable throws error', () => {
    const result = subscribeAndTestAllValues(observableThrow, [1, 2, 3]);
    expect(result).toBe('Subscription raised an error');
  });

});

describe('subscribeAndExpectValue', () => {

  it('should pass with correct expected value', () => {
    subscribeAndExpectValue(observableSingle, 1);
  });

  it('should pass when first observable value is expected', () => {
    subscribeAndTestValue(observableArray, 1);
  });

  it('should fail with incorrect expected value', () => {
    const result = subscribeAndTestValue(observableSingle, 6);
    expect(result).toBe('Subscription result does not match expected value');
  });

  it('should fail with null expected value', () => {
    const result = subscribeAndTestValue(observableArray, null);
    expect(result).toBe('Subscription result does not match expected value');
  });

  it('should fail with empty observable', () => {
    const result = subscribeAndTestValue(observableEmpty, 1);
    expect(result).toBe('Subscription produced no results');
  });

  it('should fail when observable throws error', () => {
    const result = subscribeAndTestValue(observableThrow, 1);
    expect(result).toBe('Subscription raised an error');
  });

});

describe('subscribeAndExpectNoDataEmitted', () => {

  it('should pass when observable has no values', () => {
    subscribeAndExpectNoDataEmitted(observableEmpty);
  });

  it('should fail when observable has single value', () => {
    const result = subscribeAndTestNoDataEmitted(observableSingle);
    expect(result).toBe('Subscription produced values when none were expected');
  });

  it('should fail when observable has multiple values', () => {
    const result = subscribeAndTestNoDataEmitted(observableArray);
    expect(result).toBe('Subscription produced values when none were expected');
  });

  it('should fail when observale has null value', () => {
    const result = subscribeAndTestNoDataEmitted(observableNull);
    expect(result).toBe('Subscription produced values when none were expected');
  });

  it('should fail when observable throws error', () => {
    const result = subscribeAndTestNoDataEmitted(observableThrow);
    expect(result).toBe('Subscription raised an error');
  });

});

describe('arrayEquals', () => {

  it('same array should return true', () => {
    const a = [1, 2];
    expect(arraysEqual(a, a)).toBe(true);
  });

  it('one array null should return false (left)', () => {
    const b = [1, 2];
    expect(arraysEqual(null, b)).toBe(false);
  });

  it('one array null should return false (right)', () => {
    const a = [1, 2];
    expect(arraysEqual(a, null)).toBe(false);
  });

  it('arrays of different length should return false', () => {
    const a = [1, 2];
    expect(arraysEqual(a, a.push(3))).toBe(false);
  });

  it('arrays of same items should return true', () => {
    const a = [1, 2];
    const b = [1, 2];
    expect(arraysEqual(a, b)).toBe(true);
  });

  it('arrays of different items should return false', () => {
    const a = [1, 2];
    const b = [2, 2];
    expect(arraysEqual(a, b)).toBe(false);
  });

});
