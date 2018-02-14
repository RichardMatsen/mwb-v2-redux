// tslint:disable:triple-equals

// Ref: https://github.com/hyzhak/to-have-property/blob/master/lib/index.js
//      https://github.com/angular/angular/issues/5456

export const toHavePropertiesMatcher = {
  toHaveProperties: (util) => {
    return {
      compare: (actual, expected) => {
        const result = {pass: true, message: null};
        const results = Object.keys(expected)
          .filter(prop => typeof expected[prop] !== 'function' )
          .map(key => checkProperty(actual, expected, key))
          .reduce((acc, curr) => {
            acc.pass = acc.pass && curr.pass;
            acc.message = [acc.message, curr.message].filter(msg => !!msg).join(', ');
            return acc;
          }, result);
        return results;
      }
    };
  }
};

function checkProperty(actual, expected, key) {
  const result =
    !actual.hasOwnProperty(key)
    ? { pass: false, message: `Expected property ${key} was not found` }
    : expected[key] !== undefined && expected[key] != actual[key]
      ? { pass: false, message: `Expected property ${key} to have value '${expected[key]}', but actual value is '${actual[key]}'` }
      : { pass: true, message: null };
  return result;
}
