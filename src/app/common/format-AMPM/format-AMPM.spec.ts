import { formatAMPM } from './format-AMPM';

describe('format-AMPM', () => {

  const tests = [
    { input: new Date(0), output: '1:00:00 pm'},
    { input: new Date(2016, 6, 4, 6, 54, 33), output: '6:54:33 am'},
    { input: new Date(2016, 6, 4, 18, 54, 33), output: '6:54:33 pm'},
    { input: null, output: null},
    { input: undefined, output: null},
    { input: 'aString', output: null},
    { input: 100, output: null},
  ];

  tests.forEach(test => {

    it(`should format the time part of a date: ${test.input} -> ${test.output}`, () => {
      expect(formatAMPM(test.input)).toEqual(test.output);
    });

  });
});
