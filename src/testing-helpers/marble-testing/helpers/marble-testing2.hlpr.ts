// tslint:disable-next-line:prefer-const
declare var global, expect;

function hot() {
  if (!global.rxTestScheduler) {
    throw new Error('tried to use hot() in async test');
  }
  return global.rxTestScheduler.createHotObservable.apply(global.rxTestScheduler, arguments);
}

function cold() {
  if (!global.rxTestScheduler) {
    throw new Error('tried to use cold() in async test');
  }
  return global.rxTestScheduler.createColdObservable.apply(global.rxTestScheduler, arguments);
}

function expectObservable() {
  if (!global.rxTestScheduler) {
    throw new Error('tried to use expectObservable() in async test');
  }
  return global.rxTestScheduler.expectObservable.apply(global.rxTestScheduler, arguments);
}

function expectSubscriptions() {
  if (!global.rxTestScheduler) {
    throw new Error('tried to use expectSubscriptions() in async test');
  }
  return global.rxTestScheduler.expectSubscriptions.apply(global.rxTestScheduler, arguments);
}

export default {
  hot: hot,
  cold: cold,
  expectObservable: expectObservable,
  expectSubscriptions: expectSubscriptions,
};
