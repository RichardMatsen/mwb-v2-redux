import { toDeepEqualMatcher } from './to-deep-equal.matcher';

describe('toDeepEqualMatcher', () => {

  beforeEach(() => {
    jasmine.addMatchers(toDeepEqualMatcher);
  });

  describe('nested objects that match', () => {
    it('should match empty objects', () => {
      expect({}).toDeepEqual({});
    });
    it('should match one level', () => {
      expect({ a: 1, b: 2 }).toDeepEqual({ a: 1, b: 2 });
    });
    it('should ignore functions', () => {
      expect({ a: 1, b: 2 }).toDeepEqual({ a: 1, b: 2, c: () => {} });
    });
    it('should match two levels', () => {
      expect({ a: { aa: 1 }, b: 2 }).toDeepEqual({ a: { aa: 1 }, b: 2 });
    });
    it('should match three levels', () => {
      expect({ a: { aa: { aaa: 1 } }, b: 2 }).toDeepEqual({ a: { aa: { aaa: 1 } }, b: 2 });
    });
  });

  describe('nested objects that do not match', () => {
    it('should not match empty object and null - left', () => {
      expect({}).not.toDeepEqual(null);
    });
    it('should not match empty object and null - right', () => {
      expect(null).not.toDeepEqual({});
    });
    it('should not match one level', () => {
      expect({ a: 1, b: 2 }).not.toDeepEqual({ a: 2, b: 2 });
    });
    it('should match two levels', () => {
      expect({ a: { aa: 1 }, b: 2 }).not.toDeepEqual({ a: { aa: 2 }, b: 2 });
    });
    it('should not match three levels', () => {
      expect({ a: { aa: { aaa: 1 } }, b: 2 }).not.toDeepEqual({ a: { aa: { aaa: 2 } }, b: 2 });
    });
  });

  describe('nested arrays of primitives that match', () => {
    it('should match empty arrays', () => {
      expect([]).toDeepEqual([]);
    });
    it('should match one level', () => {
      expect([1, 2]).toDeepEqual([1, 2]);
    });
    it('should match two levels', () => {
      expect([[1], 2]).toDeepEqual([[1], 2]);
    });
    it('should match three levels', () => {
      expect([[[1]], 2]).toDeepEqual([[[1]], 2]);
    });
  });

  describe('nested arrays of primitives that do not match', () => {
    it('should not match empty array and null - left', () => {
      expect([]).not.toDeepEqual(null);
    });
    it('should not match empty array and null - right', () => {
      expect(null).not.toDeepEqual([]);
    });
    it('should not match one level', () => {
      expect([1, 2]).not.toDeepEqual([2, 2]);
    });
    it('should not match different length', () => {
      expect([1, 2]).not.toDeepEqual([1]);
    });
    it('should not match two levels', () => {
      expect([[1], 2]).not.toDeepEqual([[2], 2]);
    });
    it('should not match three levels', () => {
      expect([[[1]], 2]).not.toDeepEqual([[[2]], 2]);
    });
  });

  describe('nested arrays of objects that match', () => {
    it('should match empty arrays', () => {
      expect([{}]).toDeepEqual([{}]);
    });
    it('should match one level', () => {
      expect([{x: 1}, {y: 2}]).toDeepEqual([{x: 1}, {y: 2}]);
    });
    it('should match two levels', () => {
      expect([[{x: 1}], {y: 2}]).toDeepEqual([[{x: 1}], {y: 2}]);
    });
    it('should match three levels', () => {
      expect([[[{x: 1}]], {y: 2}]).toDeepEqual([[[{x: 1}]], {y: 2}]);
    });
  });

  describe('nested arrays of objects that do not match', () => {
    it('should not match array of null - left', () => {
      expect([{}]).not.toDeepEqual([null]);
    });
    it('should not match array of null - right', () => {
      expect([null]).not.toDeepEqual([{}]);
    });

    it('should not match one level - value', () => {
      expect([{x: 1}, {y: 2}]).not.toDeepEqual([{x: 2}, {y: 2}]);
    });
    it('should not match one level - property', () => {
      expect([{x: 1}, {y: 2}]).not.toDeepEqual([{y: 1}, {y: 2}]);
    });
    it('should not match one level - type', () => {
      expect([{x: 1}, {y: 2}]).not.toDeepEqual([{x: '1'}, {y: 2}]);
    });

    it('should not match two levels - value', () => {
      expect([[{x: 1}], {y: 2}]).not.toDeepEqual([[{x: 2}], {y: 2}]);
    });
    it('should not match two levels - property', () => {
      expect([[{x: 1}], {y: 2}]).not.toDeepEqual([[{y: 1}], {y: 2}]);
    });
    it('should not match two levels - type', () => {
      expect([[{x: 1}], {y: 2}]).not.toDeepEqual([[{x: '1'}], {y: 2}]);
    });

    it('should not match three levels - value', () => {
      expect([[[{x: 1}]], {y: 2}]).not.toDeepEqual([[[{x: 2}]], {y: 2}]);
    });
    it('should not match three levels - property', () => {
      expect([[[{x: 1}]], {y: 2}]).not.toDeepEqual([[[{y: 1}]], {y: 2}]);
    });
    it('should not match three levels - type', () => {
      expect([[[{x: 1}]], {y: 2}]).not.toDeepEqual([[[{x: '1'}]], {y: 2}]);
    });
  });

});
