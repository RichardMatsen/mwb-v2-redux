import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { waitforFirstNotNull, ifNull } from './selector-helpers';

let flag = false;

describe('waitforFirstNotNull', () => {

  beforeEach(() => {
    flag = false;
  });

  it('should call function if observable contains data', () => {
    const observable = Observable.from(['one', 'two', 'three']);
    waitforFirstNotNull(observable, () => {
      flag = true;
    });
    expect(flag).toBeTruthy();
  });

  it('should not call function if observable does not contain data (null)', () => {
    const observable = Observable.of(null);
    waitforFirstNotNull(observable, () => {
      flag = true;
    });
    expect(flag).toBeFalsy();
  });

  it('should not call function if observable does not contain data (undefined)', () => {
    const observable = Observable.of(undefined);
    waitforFirstNotNull(observable, () => {
      flag = true;
    });
    expect(flag).toBeFalsy();
  });

  it('should call function with first data item only', () => {
    const observable = Observable.from(['one', 'two', 'three']);
    waitforFirstNotNull(observable, (data) => {
      expect(data).toEqual('one');
      flag = true;
    });
    expect(flag).toBeTruthy();
  });

  it('should wait for first non-null data item', () => {
    const observable = Observable.from([null, 'two', 'three']);
    waitforFirstNotNull(observable, (data) => {
      expect(data).toEqual('two');
      flag = true;
    });
    expect(flag).toBeTruthy();
  });

  it('should handle an error thrown by the observable', () => {
    const observable = Observable.throw('some error');
    const spy = spyOn(console, 'error');
    waitforFirstNotNull(observable,
      (data) => {},
      (error) => {
        expect(error).toEqual('some error');
        flag = true;
      });
    expect(flag).toBe(true);
    expect(spy).toHaveBeenCalledWith('some error');
  });

  it('should only log an error thrown by the observable when no error function supplied', () => {
    const observable = Observable.throw('some error');
    const spy = spyOn(console, 'error');
    waitforFirstNotNull(observable, (data) => {
      flag = true;
    });
    expect(flag).toBe(false);
    expect(spy).toHaveBeenCalledWith('some error');
  });

});

describe('ifNull', () => {

  beforeEach(() => {
    flag = false;
  });

  it('should not call function if observable contains data', () => {
    const observable = Observable.from(['one', 'two', 'three']);
    ifNull(observable, () => {
      flag = true;
    });
    expect(flag).toBeFalsy();
  });

  it('should call function if observable does not contain data', () => {
    const observable = Observable.of(null);
    ifNull(observable, () => {
      flag = true;
    });
    expect(flag).toBeTruthy();
  });

  it('should call function if observable is undefined', () => {
    const observable = Observable.of(undefined);
    ifNull(observable, () => {
      flag = true;
    });
    expect(flag).toBeTruthy();
  });

  it('should test first data item only and ignore the rest (first is null)', () => {
    const observable = Observable.from([null, 'two', 'three']);
    ifNull(observable, (data) => {
      expect(data).toEqual(null);
      flag = true;
    });
    expect(flag).toBeTruthy();
  });

  it('should test first data item only and ignore the rest (first is undefined)', () => {
    const observable = Observable.from([undefined, 'two', 'three']);
    ifNull(observable, (data) => {
      expect(data).toEqual(undefined);
      flag = true;
    });
    expect(flag).toBeTruthy();
  });

  it('should test first data item only and ignore the rest (first is not null)', () => {
    const observable = Observable.from(['one', null, 'three']);
    ifNull(observable, (data) => {
      flag = true;
    });
    expect(flag).toBeFalsy();
  });

  it('should handle an error thrown by the observable', () => {
    const observable = Observable.throw('some error');
    const spy = spyOn(console, 'error');
    ifNull(observable,
      (data) => {},
      (error) => {
        expect(error).toEqual('some error');
        flag = true;
      });
    expect(flag).toBe(true);
    expect(spy).toHaveBeenCalledWith('some error');
  });

  it('should only log an error thrown by the observable when no error function supplied', () => {
    const observable = Observable.throw('some error');
    const spy = spyOn(console, 'error');
    ifNull(observable, (data) => {
      flag = true;
    });
    expect(flag).toBe(false);
    expect(spy).toHaveBeenCalledWith('some error');
  });

});
