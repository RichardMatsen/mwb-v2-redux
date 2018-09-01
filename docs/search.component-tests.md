
## SearchComponent Testing Notes

1. Uses Location.path to determine which page is active, and decide if it's searchable (not strictly necessary after move of the search control from the nav-bar to the common page component)  
  Need to use SpyLocation to mock Location.

  - Can't use a standard jasmine mockLocation (component will not compile).
  - Note, jasmine mock is sufficient for similar tests on a service
  - use a simple constructor call to new-up a service:
  - searchService = new SearchService(mockLocation, mockNgReduxDispatcher, mockActions);  

  Info on SpyLocation:
  - Angular docs page for SpyLocation is missing
  - the library for Spylocation is reported in various places over time
  - currently (June 2017) is: import { SpyLocation } from "@angular/common/testing";  

  Set up SpyLocation:
  - in TestBed.configureTestingModule:
      - providers: [{provide: Location, useClass: SpyLocation}],
  - get a reference to it:
    - location = TestBed.get(Location);
  - Router and routes not needed for this test
  - To mock Location.path(), use: 
    - location.go('notSearchablePage')

2. Refactor the component to make use of NgRedux/store more granular.
This makes testing easier, as internal steps can be simply tested by expecting calls on mockActions.  

3. Use NgRedux test helpers to set up the store:
  MockNgRedux.reset();
  setupMockStore(['search'], { page: 'validations', searchTerm: 'test', results: [] })
  setupMockStore(['pages', 'validations', 'visibleFiles'], testFiles)
  logMockStore();  // Debugging: Check what is in the store 
