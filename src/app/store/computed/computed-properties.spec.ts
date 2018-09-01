import 'app/rxjs-extensions';
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';
import { TestBed, async, inject } from '@angular/core/testing';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';
import { toDeepEqualMatcher } from 'testing-helpers/jasmine-matchers/to-deep-equal.matcher';
import { Computed } from './computed-properties';
import { setupMockStore, addtoMockStore } from 'testing-helpers/testing-helpers.module.hlpr';

describe('computed properties', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgReduxTestingModule,
      ],
      providers: [
        // MockNgRedux,
        // NgRedux,
        Computed
      ]
    }).compileComponents();
  });

  let mockNgRedux, computed;
  beforeEach(
    inject([NgRedux, Computed], (ngRedux_, computed_) => {
      mockNgRedux = ngRedux_;
      computed = computed_;
  }));

  beforeEach(() => {
    jasmine.addMatchers(toDeepEqualMatcher);
  });

  let state;
  beforeEach(() => {
    /*
      MockNgRedux.getSelectorStub does not seem to handle a FunctionSelector
      so we need to stub it in the test
    */
   const mockSelect = mockNgRedux.select;
    const mockNgReduxSpy = spyOn(mockNgRedux, 'select').and.callFake(args => {
      return typeof args === 'function'
        ? Observable.of(args(state))
        :  mockSelect(args);
    });
  });


  it('should return visibleFiles', (done) => {
    const files = ['file1', 'file2', 'file3'];
    state = { pages: { aPage: { files, numVisible: 2 }}};
    setupMockStore(['pages', 'aPage'], state.pages.aPage );

    computed.visibleFiles$('aPage').subscribe(visibleFiles => {
      expect(visibleFiles).toDeepEqual(files.slice(0, 2));
      done();
    });
  });

  it('should return fileCount', (done) => {
    const files = ['file1', 'file2', 'file3'];
    state = { pages: { aPage: { files }}};
    setupMockStore(['pages', 'aPage'], state.pages.aPage );

    computed.fileCount$('aPage').subscribe(count => {
      expect(count).toEqual(3);
      done();
    });
  });

});
