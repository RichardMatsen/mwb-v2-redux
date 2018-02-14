
export function mockFactory(typeToMock) {
  const methods = Object.getOwnPropertyNames(typeToMock.prototype).filter(name => name !== 'constructor');
  const mock = jasmine.createSpyObj('mock' + typeToMock.name, methods);
  methods.forEach(method => { mock[method].and.callFake(() => { }); });
  return mock;
}

