import { toDeepEqualMatcher } from '../../jasmine-matchers/to-deep-equal.matcher';

declare var global, require, beforeEach, afterEach, jasmine, Symbol;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

import {isEqual} from 'lodash';
import * as _ from 'lodash';

const root = require('rxjs/util/root').root;
import {TestScheduler} from 'rxjs/testing/TestScheduler';

import marbleHelpers from './marble-testing2.hlpr';
import arrayObjectHelpers from './array2Object.helper.hlpr';

global.rxTestScheduler = null;
global.cold = marbleHelpers.cold;
global.hot = marbleHelpers.hot;
global.expectObservable = marbleHelpers.expectObservable;
global.expectSubscriptions = marbleHelpers.expectSubscriptions;
global.array2Object = arrayObjectHelpers.array2Object;
global.object2Array = arrayObjectHelpers.object2Array;

function assertDeepEqual(actual, expected) {
  (<any> expect(actual)).toDeepEqual(expected);
}

const glit = global.it;

global.it = function(description, cb, timeout) {
  if (cb.length === 0) {
    glit(description, function() {
      global.rxTestScheduler = new TestScheduler(assertDeepEqual);
      cb();
      global.rxTestScheduler.flush();
    });
  } else {
    glit.apply(this, arguments);
  }
};

global.it.asDiagram = function() {
  return global.it;
};

const glfit = global.fit;

global.fit = function(description, cb, timeout) {
  if (cb.length === 0) {
    glfit(description, function() {
      global.rxTestScheduler = new TestScheduler(assertDeepEqual);
      cb();
      global.rxTestScheduler.flush();
    });
  } else {
    glfit.apply(this, arguments);
  }
};

beforeEach(function() {
  jasmine.addMatchers(toDeepEqualMatcher);
});

afterEach(function() {
  global.rxTestScheduler = null;
});

(function() {
  Object.defineProperty(Error.prototype, 'toJSON', {
    value: function() {
      const alt = {};

      Object.getOwnPropertyNames(this).forEach(function(key) {
        if (key !== 'stack') {
          alt[key] = this[key];
        }
      }, this);
      return alt;
    },
    configurable: true
  });

  global.__root__ = root;
})();

global.lowerCaseO = function lowerCaseO() {
  const values = [].slice.apply(arguments);

  const o = {
    subscribe: function(observer) {
      values.forEach(function(v) {
        observer.next(v);
      });
      observer.complete();
    }
  };

  o[(<any>Symbol).observable] = function() {
    return this;
  };

  return o;
};
