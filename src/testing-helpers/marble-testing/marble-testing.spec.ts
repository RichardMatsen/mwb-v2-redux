import '../../app/rxjs-extensions';
declare var hot, cold, expectObservable, expectSubscriptions, rxTestScheduler;
// require('./helpers/test-helper2.hlpr');
import './helpers/test-helper2.hlpr';

import { Observable } from 'rxjs/Observable';

describe('Marble tests', () => {

  it('marble tests are active', () => {
    const source$ = cold( '---a---b---|');
    const expected =      '---a---b---|';
    expectObservable(source$).toBe(expected);
  });

  it('marble tests are active', () => {
    const source$ = cold( 'aaaabbb---|');
    const expected =      'aaaabbb---|';
    expectObservable(source$).toBe(expected);
  });

  it('should work with cold observables', () => {
    const obs1 = cold('-a---b-|');
    const obs2 = cold('-c---d-|');
    const expected =  '-a---b--c---d-|';

    expectObservable(obs1.concat(obs2)).toBe(expected);
  });

  it('should work with hot observables', () => {
    const obs1 = hot('---a--^-b-|');
    const obs2 = hot('-----c^----d-|');
    const expected =       '--b--d-|';

    expectObservable(obs1.concat(obs2)).toBe(expected);
  });

  it('should identify subscription points', () => {
    const obs1 = cold('-a---b-|');
    const obs2 = cold('-c---d-|');
    const expected =  '-a---b--c---d-|';
    const sub1 =      '^------!';
    const sub2 =      '-------^------!';

    const sut = obs1.concat(obs2);
    expectObservable(sut).toBe(expected);
    expectSubscriptions(obs1.subscriptions).toBe(sub1);
    expectSubscriptions(obs2.subscriptions).toBe(sub2);
  });

  it('should correctly sub in values', () => {
    const values = {a: 1, b: 2};
    const source = cold(  '---a---b---|', values);
    const expected =      '---a---b---|';

    expectObservable(source).toBe(expected, values);
  });

  it('should handle emissions in same time frame', () => {
    const obs1 = Observable.of(1, 2, 3);
    const expected = '(abc|)';

    expectObservable(obs1).toBe(expected, {a: 1, b: 2, c: 3});
  });

  it('should work with asynchronous operators', () => {
    const obs1 = Observable
      .interval(10, rxTestScheduler)
      .take(5)
      .filter(v => v % 2 === 0);
    const expected = '-a-b-(c|)';

    expectObservable(obs1).toBe(expected, {a: 0, b: 2, c: 4});
  });

  it('should handle errors', () => {
    const source = Observable.of(1, 2, 3)
      .map(val => {
        if (val > 2) {
          throw new Error('Number too high!');
        };
        return val;
      })
      .retry(2);

    const expected = '(ababab#)';
    expectObservable(source).toBe(expected, {a: 1, b: 2, c: 3},
      {'message': 'Number too high!'});
  });

});
