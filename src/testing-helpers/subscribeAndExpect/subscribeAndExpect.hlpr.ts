import { Observable } from 'rxjs/Observable';

/*
  Testing helper functions for observables
*/
export function subscribeAndExpectAllValues(observable: Observable<any>, expected: any[] ) {
  const failed = subscribeAndTestAllValues(observable, expected);
  expect(failed).toBeFalsy(failed);
}
export function subscribeAndTestAllValues(observable: Observable<any>, expected: any[] ): string {
  let fail;
  const sub = observable
    .toArray()  // toArray returns all results,
                // and ensures the subscription (and expectation)
                // happens even when there are no observables output (result is empty array)
    .subscribe(
      result => {
        if (!arraysEqual(result, expected)) {
          fail = 'Subscription results do not match expected array';
        }
      },
      (error) => {
        fail = 'Subscription raised an error';
      }
    );
  sub.unsubscribe();
  return fail;
}

export function subscribeAndExpectValue(observable: Observable<any>, expected: any) {
  const failed = subscribeAndTestValue(observable, expected);
  expect(failed).toBeFalsy(failed);
}
export function subscribeAndTestValue(observable: Observable<any>, expected: any): string {
  let fail;
  let wasSubscribed = false;
  const sub = observable
    .take(1)
    .subscribe(
      result => {
        if (result !== expected) {
          fail = 'Subscription result does not match expected value';
        }
        wasSubscribed = true;
      },
      (error) => {
        fail = 'Subscription raised an error';
      },
      (/*completed*/) => {
        // When testing a single value,
        // need to check that the subscription was activated,
        // otherwise the expected value is never tested
        if (!wasSubscribed) {
          fail = 'Subscription produced no results';
        }
      }
    );
  sub.unsubscribe();
  return fail;
}

export function subscribeAndExpectNoDataEmitted(observable: Observable<any>) {
  const failed = subscribeAndTestNoDataEmitted(observable);
  expect(failed).toBeFalsy(failed);
}
export function subscribeAndTestNoDataEmitted(observable: Observable<any>): string {
  let fail;
  let wasSubscribed = false;
  const sub = observable
    .subscribe(
      result => {
        wasSubscribed = true;
      },
      (error) => {
        fail = 'Subscription raised an error';
      },
      (/*completed*/) => {
        if (wasSubscribed) {
          fail = 'Subscription produced values when none were expected';
        }
      }
    );
  sub.unsubscribe();
  return fail;
}

export function arraysEqual(a, b) {
  if (a === b) {return true; };
  if (a == null || b == null) {return false; };
  if (a.length !== b.length) {return false; };
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {return false; };
  }
  return true;
}
