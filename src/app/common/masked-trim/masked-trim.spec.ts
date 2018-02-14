require('./masked-trim');

describe('masked-trim', () => {
  it('should trim both ends', () => {
    expect(' -123- '.trimWithMask(' -')).toEqual('123');
  });
});
