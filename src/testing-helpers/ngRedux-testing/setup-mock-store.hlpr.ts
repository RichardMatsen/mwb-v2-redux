import { Observable } from 'rxjs/Observable';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';

export function setupMockStore<R, S>(selector, values) {
  MockNgRedux.reset();
  return addtoMockStore<R, S>(selector, values);
}

export function addtoMockStore<R, S>(selector, values) {
  const stub = MockNgRedux.getSelectorStub<R, S>(selector);
  stub.next(values);
  stub.complete();
  return stub;
}
