import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/never';
const x = require('./selector-helpers');

let flagData = false;
let flagError = false;
let flagComplete = false;

describe('waitfor$ (invokes chained function if observable is truthy)', () => {

  beforeEach(() => {
    flagData = false;
    flagError = false;
    flagComplete = false;
  });

  it('should call function if observable contains data', () => {
    const observable = Observable.from(['one', 'two', 'three']);
    observable.waitFor$()
      .subscribe(
        (data) => { flagData = true; },
        (error) => { flagError = true; },
        (/*complete*/) => { flagComplete = true; }
      );
    expect(flagData).toBeTruthy();
    expect(flagError).toBeFalsy();
    expect(flagComplete).toBeTruthy();
  });

  it('should not call function if observable contains null', () => {
    const observable = Observable.of(null);
    observable.waitFor$()
      .subscribe(
        (data) => { flagData = true; },
        (error) => { flagError = true; },
        (/*complete*/) => { flagComplete = true; }
      );
    expect(flagData).toBeFalsy();
    expect(flagError).toBeFalsy();
    expect(flagComplete).toBeTruthy();
  });

  it('should not call function if observable contain undefined', () => {
    const observable = Observable.of(undefined);
    observable.waitFor$()
      .subscribe(
        (data) => { flagData = true; },
        (error) => { flagError = true; },
        (/*complete*/) => { flagComplete = true; }
      );
    expect(flagData).toBeFalsy();
    expect(flagError).toBeFalsy();
    expect(flagComplete).toBeTruthy();
  });

  it('should not call function if observable terminates and does not contain data (empty)', () => {
    const observable = Observable.empty();
    observable.waitFor$()
      .subscribe(
        (data) => { flagData = true; },
        (error) => { flagError = true; },
        (/*complete*/) => { flagComplete = true; }
      );
    expect(flagData).toBeFalsy();
    expect(flagError).toBeFalsy();
    expect(flagComplete).toBeTruthy();
  });

  it('should not call function if observable does not terminate and does not contain data (never)', () => {
    const observable = Observable.never();
    observable.waitFor$()
      .subscribe(
        (data) => { flagData = true; },
        (error) => { flagError = true; },
        (/*complete*/) => { flagComplete = true; }
      );
    expect(flagData).toBeFalsy();
    expect(flagError).toBeFalsy();
    expect(flagComplete).toBeFalsy();
  });

  it('should call function with first data item only', () => {
    const observable = Observable.from(['one', 'two', 'three']);
    observable.waitFor$()
      .subscribe(
        (data) => {
          flagData = true;
          expect(data).toEqual('one');
        },
        (error) => { flagError = true; },
        (/*complete*/) => { flagComplete = true; }
      );
    expect(flagData).toBeTruthy();
    expect(flagError).toBeFalsy();
    expect(flagComplete).toBeTruthy();
  });

  it('should wait for first non-null data item', () => {
    const observable = Observable.from([null, 'two', 'three']);
    observable.waitFor$()
      .subscribe(
        (data) => {
          flagData = true;
          expect(data).toEqual('two');
        },
        (error) => { flagError = true; },
        (/*complete*/) => { flagComplete = true; }
      );
    expect(flagData).toBeTruthy();
    expect(flagError).toBeFalsy();
    expect(flagComplete).toBeTruthy();
  });

  describe('timing', () => {

    it('should wait for first truthy value then evaluate', () => {
      const observable = new Subject();
      observable.waitFor$()
        .subscribe(data => { flagData = true; });
      expect(flagData).toBeFalsy();

      observable.next(null);
      expect(flagData).toBeFalsy();

      observable.next(undefined);
      expect(flagData).toBeFalsy();

      observable.next('a value');
      expect(flagData).toBeTruthy();
    });

    it('should wait for first truthy value and ignore subsequent truthy values', () => {
      const observable = new Subject();
      observable.waitFor$()
        .subscribe(data => { flagData = true; });
      expect(flagData).toBeFalsy();

      observable.next(null);
      expect(flagData).toBeFalsy();

      observable.next('a value');
      expect(flagData).toBeTruthy();

      flagData = false;
      observable.next('another value');
      expect(flagData).toBeFalsy();
    });
  });

});

describe('waitForWithCondition$ (invokes chained function if observable is truthy and predicate return true)', () => {

  beforeEach(() => {
    flagData = false;
    flagError = false;
    flagComplete = false;
  });

  it('should pass if condition is true', () => {
    const observable = Observable.from(['one', 'two', 'three']);
    observable.waitForWithCondition$(data => data[0] === 'o')
      .subscribe(
        (data) => { flagData = true; },
        (error) => { flagError = true; },
        (/*complete*/) => { flagComplete = true; }
      );
    expect(flagData).toBeTruthy('flagData');
    expect(flagError).toBeFalsy('flagError');
    expect(flagComplete).toBeTruthy('flagComplete');
  });

  it('should not pass if observable contains null', () => {
    const observable = Observable.of(null);
    observable.waitForWithCondition$(data => true)
      .subscribe(
        (data) => { flagData = true; },
        (error) => { flagError = true; },
        (/*complete*/) => { flagComplete = true; }
      );
    expect(flagData).toBeFalsy('flagData');
    expect(flagError).toBeFalsy('flagError');
    expect(flagComplete).toBeTruthy('flagComplete');
  });

  it('should not pass if condition is false', () => {
    const observable = Observable.from(['one', 'two', 'three']);
    observable.waitForWithCondition$(data => data[0] === 'z')
      .subscribe(
        (data) => { flagData = true; },
        (error) => { flagError = true; },
        (/*complete*/) => { flagComplete = true; }
      );
    expect(flagData).toBeFalsy('flagData');
    expect(flagError).toBeFalsy('flagError');
    expect(flagComplete).toBeTruthy('flagComplete');
  });

  it('should pass if predicate is null', () => {
    const observable = Observable.from(['one', 'two', 'three']);
    observable.waitForWithCondition$()
      .subscribe(
        (data) => { flagData = true; },
        (error) => { flagError = true; },
        (/*complete*/) => { flagComplete = true; }
      );
    expect(flagData).toBeTruthy('flagData');
    expect(flagError).toBeFalsy('flagError');
    expect(flagComplete).toBeTruthy('flagComplete');
  });

});


const itResolves = (data) => {
  const observable = Array.isArray(data) ? Observable.from(data) : Observable.of(data);  // use stream if array of data
  const result = observable.snapshot();
  expect(result).toEqual(data);
  if (Array.isArray(data)) {
    expect(result.length).toEqual(data.length);
  }
};

describe('snapshot (resolves an observable)', () => {

  it('should resolve observable data', () => {
    itResolves(['one', 'two', 'three']);
  });

  it('should resolve observable data with null value in stream', () => {
    itResolves(['one', null, 'three']);
  });

  it('should resolve observable with a single value', () => {
    itResolves('one');
  });

  it('should resolve observable of null', () => {
    itResolves(null);
  });

  it('should resolve observable of undefined', () => {
    itResolves(undefined);
  });

  it('should apply the transform', () => {
    const observable = Observable.from(['one', 'two', 'three']);
    const result = observable.snapshot(dataArray => dataArray.filter(dataItem => dataItem[0] === 't'));
    expect(result).toEqual(['two', 'three']);
  });

  describe('when observable is empty', () => {

    it('should downgrade an empty array to undefined', () => {
      const observable = Observable.from([]);
      const result = observable.snapshot();
      expect(result).toBe(undefined);
    });

    it('should downgrade an empty array to undefined (empty observable)', () => {
      const observable = Observable.empty();
      const result = observable.snapshot();
      expect(result).toBe(undefined);
    });

    it('should downgrade an empty array to undefined (after transform)', () => {
      const observable = Observable.from(['one', 'two', 'three']);
      const result = observable.snapshot(dataArray => dataArray.filter(dataItem => dataItem[0] === 'z'));
      expect(result).toBe(undefined);
    });

  });

});

describe('ifNull$ (tests an observable for falsy value)', () => {

  beforeEach(() => {
    flagData = false;
  });

  it('should not call chained observable function if source contains data', () => {
    const source = Observable.from(['one', 'two', 'three']);
    source.ifNull$()
      .subscribe(data => {
        flagData = true;
    });
    expect(flagData).toBeFalsy();
  });

  it('should call chained observable function if source does not contain data', () => {
    const source = Observable.of(null);
    source.ifNull$()
      .subscribe(data => {
        flagData = true;
    });
    expect(flagData).toBeTruthy();
  });

  it('should call chained observable function if source is undefined', () => {
    const source = Observable.of(undefined);
    source.ifNull$()
      .subscribe(data => {
        flagData = true;
    });
    expect(flagData).toBeTruthy();
  });

  it('should test first data item only and ignore the rest (first is null)', () => {
    const observable = Observable.from([null, 'two', 'three']);
    observable.ifNull$()
      .subscribe(data => {
        flagData = true;
    });
    expect(flagData).toBeTruthy();
  });

  it('should test first data item only and ignore the rest (first is not null)', () => {
    const observable = Observable.from(['one', null, 'three']);
    observable.ifNull$()
      .subscribe(data => {
        flagData = true;
    });
    expect(flagData).toBeFalsy();
  });

});

describe('logSnapshot', () => {

  it('should log the snapshot', () => {
    const observable = Observable.from(['one', 'two', 'three']);
    const spy = spyOn(console, 'log');
    observable.logSnapshot();
    expect(spy).toHaveBeenCalledWith('Snapshot: ', ['one', 'two', 'three']);
  });

  it('should return the observable in original format', () => {
    const observable = Observable.from(['one', 'two', 'three']);
    const result = observable.logSnapshot();
    expect(result).toEqual(Observable.from(['one', 'two', 'three']));
  });

  it('should apply the transform to the log output', () => {
    const observable = Observable.from(['one', 'two', 'three']);
    const spy = spyOn(console, 'log');
    const result = observable.logSnapshot(dataArray => dataArray.filter(dataItem => dataItem[0] === 't'));
    expect(spy).toHaveBeenCalledWith('Snapshot: ', ['two', 'three']);
    expect(result).toEqual(Observable.from(['one', 'two', 'three']));
  });

});
