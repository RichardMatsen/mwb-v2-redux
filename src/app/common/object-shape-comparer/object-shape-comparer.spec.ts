import { ObjectShapeComparer } from './object-shape-comparer';

describe('ObjectShapeComparer', () => {

  let comparer;
  beforeEach(() => {
    comparer = new ObjectShapeComparer();
  });

  it('should compare a template object to another object and return a list of differences', () => {
    const diffs = comparer.compare(
      {test: ''},
      {test: 'some text'}
    );
    expect(diffs).toEqual([]);
  });

  describe('function handling', () => {
    it('should ignore functions', () => {
      const diffs = comparer.compare(
        {test: '', doIt: () => {} },
        {test: 'some text'}
      );
      expect(diffs).toEqual([]);
    });
  });

  describe('property handling', () => {

    it('should flag missing properties', () => {
      const diffs = comparer.compare(
        {test1: '', test2: ''},
        {test1: 'some text'}
      );
      expect(diffs).toEqual(['Missing property test2']);
    });

    it('should flag differently named properties', () => {
      const diffs = comparer.compare(
        {test1: '', test2: ''},
        {test1: 'some text', test3: 'some other text'}
      );
      expect(diffs).toEqual(['Missing property test2']);
    });

    it('should flag all differences', () => {
      const diffs = comparer.compare(
        {test1: '', test2: '', test3: ''},
        {test1: 'some text'}
      );
      expect(diffs).toEqual(['Missing property test2', 'Missing property test3']);
    });

    it('should ignore extra properties on actual', () => {
      const diffs = comparer.compare(
        {test1: ''},
        {test1: 'some text', test2: 'some other text'}
      );
      expect(diffs).toEqual([]);
    });
  });

  describe('value handling', () => {

    it('should ignore value differences', () => {
      const diffs = comparer.compare(
        {test: 'some text'},
        {test: 'some other text'}
      );
      expect(diffs).toEqual([]);
    });
  });

  describe('type handling', () => {

    it('should flag type differences (number vs string)', () => {
      const diffs = comparer.compare(
        {test: 0},
        {test: 'some text'}
      );
      expect(diffs).toEqual(['Types differ for property test (number vs string)']);
    });

    it('should flag type differences (object vs string)', () => {
      const diffs = comparer.compare(
        {test: {x: ''}},
        {test: 'some text'}
      );
      expect(diffs).toEqual(['Types differ for property test (object vs string)', 'Missing property test.x']);
    });

    it('should flag type differences (object vs array)', () => {
      const diffs = comparer.compare(
        {test: {x: ''}},
        {test: [{x: ''}]}
      );
      expect(diffs).toEqual(['Types differ for property test (object vs array)', 'Missing property test.x']);
    });

    it('should ignore type when template uses undefined value', () => {
      const diffs = comparer.compare(
        {test: undefined},
        {test: 'some other text'}
      );
      expect(diffs).toEqual([]);
    });
  });

  describe('property order', () => {

    it('should ignore property order when no diifs', () => {
      const diffs = comparer.compare(
        {test2: '', test1: ''},
        {test1: 'some text', test2: 'some other text'}
      );
      expect(diffs).toEqual([]);
    });

    it('should ignore property order when diffs', () => {
      const diffs = comparer.compare(
        {test2: '', test1: ''},
        {test1: 'some text'}
      );
      expect(diffs).toEqual(['Missing property test2']);
    });
  });

  describe('nesting', () => {

    it('should flag diffs on nested objects', () => {
      const diffs = comparer.compare(
        {test: {sub1: ''}},
        {test: {sub2: 'some text'}}
      );
      expect(diffs).toEqual(['Missing property test.sub1']);
    });

    it('should full qualify nested paths', () => {
      const diffs = comparer.compare(
        {test: {sub1: {sub2: {sub3: {sub4: ''}}}}},
        {test: {sub1: {sub2: {sub3: {sub5: 'some text'}}}}}
      );
      expect(diffs).toEqual(['Missing property test.sub1.sub2.sub3.sub4']);
    });

    it('should flag structure diffs when levels differ', () => {
      const diffs = comparer.compare(
        {test: {sub0: {sub1: ''}}},
        {test: {sub1: 'some text'}}
      );
      expect(diffs).toEqual(['Missing property test.sub0']);
    });

    it('should flag type diffs when levels differ', () => {
      const diffs = comparer.compare(
        {test: {sub1: {sub2: ''}}},
        {test: {sub1: 'some text'}}
      );
      expect(diffs).toEqual(['Types differ for property test.sub1 (object vs string)', 'Missing property test.sub1.sub2']);
    });
  });

  describe('arrays', () => {

    it('should flag array diffs', () => {
      const diffs = comparer.compare(
        {test: [{sub1: ''}, {sub2: ''}, {sub3: ''}]},
        {test: [{sub1: ''}, {sub2: ''}          ]}
      );
      expect(diffs).toEqual(['Missing array element test.2 (keys: sub3)']);
    });

    describe('array ordering', () => {

      it('should ignore array ordering', () => {
        const diffs = comparer.compare(
          {test: [{sub3: ''}, {sub2: ''}, {sub1: ''}]},
          {test: [{sub1: ''}, {sub2: ''}, {sub3: ''}]}
        );
        expect(diffs).toEqual([]);
      });

      it('should flag array diffs regardless of array ordering', () => {
        const diffs = comparer.compare(
          {test: [{sub3: ''}, {sub2: ''}, {sub1: ''}]},
          {test: [{sub1: ''}, {sub2: ''}]}
        );
        expect(diffs).toEqual(['Missing array element test.0 (keys: sub3)']);
      });
    });

    describe('nested arrays', () => {

      it('should flag nested array diffs', () => {
        const diffs = comparer.compare(
          {test: [{sub1: [{subsub1: ''}, {subsub2: ''}, {subsub3: ''}]}, {sub2: []}]},
          {test: [{sub1: [{subsub1: ''}, {subsub2: ''}             ]}, {sub2: []}]}
        );
        expect(diffs).toEqual(['Missing array element test.0.sub1.2 (keys: subsub3)']);
      });
    });

  });
});
