import {isEqual} from 'lodash';

export const toDeepEqualMatcher = {
  toDeepEqual: (util) => {
    return {
        compare: function(actuals, expecteds) {
          const test = compareArrays(actuals, expecteds);
          const result = { pass: (test === 'pass'), message: `compareArrays say: ${test}` + '\n\n' };

          if (!result.pass && Array.isArray(actuals) && Array.isArray(expecteds)) {
            result.message += 'Actual \n';
            actuals.forEach(function(x) {
              result.message += stringify(x) + '\n';
            });
            result.message += '\nExpected \n';
            expecteds.forEach(function(x) {
              result.message += stringify(x) + '\n';
            });
          }
          return result;
        }
    };
  }
};

function compareArrays(actuals, expecteds): any {

  if ((actuals !== null && expecteds === null) || (actuals === null && expecteds !== null)) {
    return 'Failed: Non-null does not compare to null';
  }

  if (actuals.length !== expecteds.length) {
    return 'Failed: Arrays not the same length';
  }

  if (!Array.isArray(actuals) || !Array.isArray(expecteds)) {
    return compareValues(expecteds, actuals, -1);
  }

  for (let idx = 0; idx < expecteds.length; idx++ ) {
    const expected = expecteds[idx];
    const actual = actuals[idx];
    const result = compareValues(actual, expected, idx);
    if (result !== 'pass') {
      return result;
    }
  }

  return 'pass';
}

/*
  Compares objects irrespective of the property ordering
  and only compares those properties supplied in 'expected'
  Saves a bit of refactoring in tests when 'actual' property order changes,
  or new properties are added that are irrelevant to the test
*/
function compareProperties(actual, expected, idx): any {

  for (const key in expected) {

    if (typeof expected[key] === 'function') {
      continue;  // ignore function properties
    }

    const value = expected[key];
    if (value === undefined) {
      continue;
    }

    if (!actual.hasOwnProperty(key)) {
      return `Index: ${idx}, Actual has no property '${key}'`;
    }

    const otherValue = actual[key];

    const types = compareTypes(value, otherValue, key, idx);
    if (types !== 'pass') {
      return types;
    }

    const values = compareValues(value, otherValue, idx);
    if (values !== 'pass') {
      return values;
    }
  }
  return 'pass';
}

function compareTypes(value, otherValue, key, idx): any {
  return typeof value === typeof otherValue ? 'pass'
    : `Index: ${idx}, Key: '${key}', Types differ ('${typeof value}' vs '${typeof otherValue}')`;
}

function compareValues(value, otherValue, idx): any {
  if ((value !== null && otherValue === null) || (value === null && otherValue !== null)) {
    return 'Failed: Non-null does not compare to null';
  }
  if (typeof value === 'object') {
    return compareProperties(value, otherValue, idx);
  }
  return value === otherValue ? 'pass'
    : `Index: ${idx}, Not objects, values differ (${value} vs ${otherValue})`;
}

function stringify(x) {
  return JSON.stringify(x, function(key, value) {
    if (Array.isArray(value)) {
      return '[' + value
        .map(function(i) {
          return '\n\t' + stringify(i);
        }) + '\n]';
    }
    return value;
  })
    .replace(/\\"/g, '"')
    .replace(/\\t/g, '\t')
    .replace(/\\n/g, '\n');
}
