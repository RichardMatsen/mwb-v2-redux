import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toArray';

export function waitforFirstNotNull<T>(selector$: Observable<T>, fnOnData, fnOnError = null) {
  selector$
    .filter(data => !!data)
    .take(1)
    .subscribe(
      (data) => { fnOnData(data); },
      (error) => { console.error(error); if (fnOnError) { fnOnError(error); } }
    );
}

export function ifNull<T>(selector$: Observable<T>, fnWhenNoData, fnOnError = null) {
  selector$
    .take(1)
    .filter(data => data === null || data === undefined)
    .subscribe(
      (falsyData) => { fnWhenNoData(falsyData); },
      (error) => { console.error(error); if (fnOnError) { fnOnError(error); } }
    );
}

export const waitFor$ = function() {
  return this
    .filter(data => !!data )
    .take(1);
};

export const waitForWithCondition$ = function(predicate = null) {
  return this.filter(data => !!data && (!!predicate ? predicate(data) : true ) ).take(1);
};

export const ifNull$ = function() {
  return this.take(1)
    .filter(data => data === null || data === undefined);
};

export const snapshot = function(transform = null): any[] | any | undefined {
  transform = transform || function(data) { return data; };  // if no fn given, assign a pass-through
  let result = null;
  this
    .toArray()  // gather all values
    .subscribe(data => {
      result = transform(data);
      result = (result.length === 0) ? undefined  // down-grade an empty array to undefined
        : (result.length === 1) ? result[0]       // down-grade a single value array to the single value
        : result;
      });
  return result;
};

export const logSnapshot = function(transform = null) {
  console.log('Snapshot: ', this.snapshot(transform));
  return this;
};

Observable.prototype.waitFor$ = waitFor$;
Observable.prototype.waitForWithCondition$ = waitForWithCondition$;
Observable.prototype.ifNull$ = ifNull$;
Observable.prototype.snapshot = snapshot;
Observable.prototype.logSnapshot = logSnapshot;

declare module 'rxjs/Observable' {
  // tslint:disable-next-line:no-shadowed-variable
  interface Observable<T> {
    waitFor$: typeof waitFor$;
    waitForWithCondition$: typeof waitForWithCondition$;
    ifNull$: typeof ifNull$;
    snapshot: typeof snapshot;
    logSnapshot: typeof logSnapshot;
  }
}
