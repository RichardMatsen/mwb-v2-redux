
// Ref: https://github.com/JamieMason/Jasmine-Matchers
// module.exports = (subString, actual) => actual.slice(0, subString.length) === subString;

export const toStartWithMatcher = {
  toStartWith: (util) => {
    return {
      compare: (actual, expected) => {
        const result = {pass: true, message: null};
        result.pass = actual.slice(0, expected.length) === expected;
        return result;
      }
    };
  }
};


