
# Redux Store

Here are some notes about implementing redux.

**Redux store feels like 'managed global' data**  
Can access state from anywhere using @select() decorator, so it feels a lot like global data, but of course is managed via the redux one-way data flow.

**Replacing @Input's and @Output's with Redux state.**  
Where there are a lot of @Inputs and @Outputs, Redux state can reduce clutter in the template, reduce chance of typo's (particularly in template which may not raise an error).  
On the other hand, @Inputs and @Outputs more explicitly show the coupling between parent and child components. Also need to use these properties if using ngOnChanges, as they hook into Angular change detection.

**Replacing shared data Services with Redux state.**  
Using redux state instead of an Angular service to share data gives a cleaner application. The shared service must be injected, and must be provided in the appropriate place in the injector tree. Mistakes in injector placement can lead to different instances being used.  
For example, in this app, we want to cache files read from disk so they can be used on the Dashboard or on the detail pages. Without Redux, the cache is implemented in a service provided at the app level and injected into each page.


## Redux described
Redux moves state out of components and into a central store object. State updates are carried out by issuing actions, and state usage is via subcription to observables of parts of the overall state. State changes occur in reducer functions, which preserve the previous state.  

**The primary advantages are:**
* clearer state management, particularly when more than one component uses the same state
* automatic audit trail, and nice debugging tool with the chrome devtool
* separation of state update code makes it more testable

**Disadvantages are:**
* State access via subscriptions means more complex usage expressions
  * Async pipe is required in templates
  * Code access requires subscription  
  * Subscriptions need to be explicitly closed when component is destroyed 

* Unless careful, mutation can occur where state is nested, with no warning  signs. The change audit trail is then quite misleading. See section below on **freezeState**.

* Subscriptions are 'always on', so mixing subscriptions and action dispatch in the same code (chain) can lead to repeated firing. For example, if a dispatch is conditional on the existing state, and one of the update values is non-deterministic (e.g time of last refresh). See section below on **selector-helpers**.  

* Need to be aware that when changing sequential code to dispatch / subscribe pattern, the dispatch is async and likely to finish after the next sequential statement executes. The upshot is:
  * the AppState tree is initialized in the root component, before any services can run to provide values.
  * therefore, it is easiest to make state branches nullable
  * subscriptions on nullable brances may return null (until initialized), and therefore need additional guard code at the point of use. See section below on **selector-helpers**.

## The library
Redux state store was implemented with [angular-redux/store](https://github.com/angular-redux/store). This library is relatively unopinionated, so is a good choice if you want to work from basic principles.  

This library provides:
* an injectable reference to the store, mainly used to access the `dispatch()` function
```javascript
  import { NgRedux } from '@angular-redux/store';
  import { IAppState } from '../store/state/AppState';

  constructor(
    private ngRedux: NgRedux<IAppState>,
    ...
  ) {}
```

* an observable decorator for component properties
```javascript
  import { select } from '@angular-redux/store';

  @select('measures') measures$: Observable<IMeasure[]>
```

### Steps to implement

1. **Initilize the store.** The common pattern is to use `createStore()` or `configureStore()` in the root app module. A slightly better approach is the do this work in a StoreModule and import it into the root app module.
Ref: ['angular-redux/example-app/src/app/store/store.module.ts'](https://github.com/angular-redux/example-app/blob/master/src/app/store/store.module.ts)  

    _app.module.ts_
    ```javascript
      import { StoreModule } from './store/store.module';
      ...
      @NgModule({
        imports: [
          ...
          StoreModule,
        ],
        ...
        bootstrap: [AppComponent]
      })
      export class AppModule {}

    ```
    _store.module.ts (simplified)_
    ```javascript
    import { NgReduxModule, NgRedux, DevToolsExtension } from '@angular-redux/store';
    import { reduxLogger, createLogger } from 'redux-logger';

    import freezeState from './freezeState';
    import { HttpMiddleware } from './http.middleware'

    @NgModule({
      imports: [ NgReduxModule ],
      providers: [
        HttpMiddleware,
      ],
    })
    export class StoreModule {
      constructor(
        public store: NgRedux<IAppState>,
        devTools: DevToolsExtension,
        httpMiddleware: HttpMiddleware,
      ) {
        store.configureStore(
          rootReducer,                                            // reducer
          initialState,                                           // state
          [freezeState, httpMiddleware.httpMiddlewareFactory()],  // middleware
          devTools.isEnabled() ? [ devTools.enhancer() ] : []     // enhancers
        );
      }
    }
    ```
2. **Create actions.** Actions are simple declarative notification of events. As in all event based patterns, the benefits for extra effort are:
    * Separation of event cause from event handling, so easier testing (less mocking).
    * Cross-cutting concerns (logging, async calls) implemented in middleware, part of the pipeline.
    * An easy hook to log the events, along with a great tool to review (redux chrome devtool). 

    Actions are easy to construct, but there's a few descisions about which actions to create.  
      * Which state should move to the store? Not all state needs to move out of components, these are candidates:
        * Shared state (probably resides in services) decouples the components that share it.
        * State that that is useful for debugging (immediate or replay)
        * State that is subject to external error (e.g api calls)



-------------------

## Middleware

### **freezeState**

freezeState is a middleware function that ensures the state remains immutable.  

```javascript
export function freezeState(store) {
  return (next) => (action) => {
    const result = next(action);
    const state = store.getState();
    deepFreeze(state);
    return result;
  };
}
```

Technically, the purpose of this middleware is to insure the reducers do not mutate state. When mutation occurs, an error is thrown since state is frozen at all levels of the tree (deep frozen).  
The functionality is not needed in production since the reducers are in final/released state. Therefore, we conditionally add this middleware during development only.  

```javascript
const middleware =
  (environment.production ? [] : [freezeState])
  .concat(
    this.httpMiddleware.httpMiddlewareFactory(),
    this.uiMiddleware.uiMiddlewareFactory(),
    // logger
  );

this.ngRedux.configureStore(
  rootReducer,
  appInitialState,
  [...middleware],
  this.devTools.isEnabled() ? [ this.devTools.enhancer({ predicate: includeActions }) ] : []
);
```

Testing the `freezeState` function
```javascript
const state = { x: 1 };
const mockStore = jasmine.createSpyObj('mockStore', ['dispatch', 'getState']);
mockStore.getState.and.returnValue(state);
const mockNext = jasmine.createSpy('next');
const action = { type: 'NOP' };

it('should freeze state', () => {
  freezeState(mockStore)(mockNext)(action);
  // tslint:disable-next-line:quotemark
  expect(() => { state.x = 2; }).toThrow( new TypeError("Cannot assign to read only property 'x' of object '[object Object]'"));
});
```
-------------------

### **httpMiddleware**

This provides common code for http get requests initiated via actions.  
The middleware is triggered if the action has a property `httpRequest`.
- maps to success action or failure action
- validation of response (optional)
- triggers and removes UI loading indicator
- specifies 404 page message (optional)

```javascript
export type HttpRequest = {
  url: string,
  successAction: Function,      // action creator for success, data passed in
  failedAction: Function,       // action creator for failure, error passed in
  validateResponse?: Function,  // validate the response, call successAction or failedAction
  four0FourMessage?: string     // message for 404 page, when return status is 404
};
```

-------------------

### **uiMiddleware**

The UI middleware is used to turn a spinner on and off when a long-running process executes.  
The spinner component template is conditionally shown depending on the store property `activeRequests`.   

```javascript
@Component({
  selector: 'mwb-spinner',
  template: `
    <div class="loading-overlay" *ngIf="(activeRequests$ | async) > 0">
      <i class="center-fix main-spinner fa fa-spin fa-spinner"></i>
    </div>
  `,
  ...
export class SpinnerComponent {
  @select(['ui', 'activeRequests']) activeRequests$: number;
}
```
When a service wants to flag a long-running process, it dispatches an action with the `uiStartLoading` property.  
It then signals completion by dispatching another action with the `uiEndLoading` property.

For example, when measures are calculated there is formatting and aggregation taking place that is long enough to justify spinner display. 

```javascript
export class MeasureActions {

  static INITIALIZE_MEASURES_REQUEST = 'INITIALIZE_MEASURES_REQUEST';
  static INITIALIZE_MEASURES_SUCCESS = 'INITIALIZE_MEASURES_SUCCESS';
  static INITIALIZE_MEASURES_FAILED = 'INITIALIZE_MEASURES_FAILED';
  ...
  createInitializeMeasuresRequest() {
    return {
      type: MeasureActions.INITIALIZE_MEASURES_REQUEST,
      uiStartLoading: MeasureActions.INITIALIZE_MEASURES_REQUEST,
      excludeFromLog: true,
    };
  }
  ...
  createInitializeMeasuresSuccess(measures: IMeasure[]) {
    return {
      type: MeasureActions.INITIALIZE_MEASURES_SUCCESS,
      uiEndLoading: MeasureActions.INITIALIZE_MEASURES_SUCCESS,
      payload: { measures }
    };
  }
  ...
  createInitializeMeasuresFailed(error) {
    return {
      type: MeasureActions.INITIALIZE_MEASURES_FAILED,
      uiEndLoading: MeasureActions.INITIALIZE_MEASURES_FAILED,
      payload: { measures: [this.errorMeasure(error)] }
    };
  }
```

Note that the ui state `activeRequests` property allows for multiple concurrent triggers (the spinner is shown as long as activeRequests > 0).

-------------------


```javascript
export type UiActionType = {
  type: string,
  payload?: UiState,          // Constrain the payload properties to match those on state
  trigger?: string,           // Append to the action type to show what action triggered this action
  excludeFromLog?: boolean,   // Devtools enhancer will filter this action from the log
  message?: string,           // Message to display on the 404 screen
};

uiMiddlewareFactory() {
  const vm = this;
  return function uiMiddleware(store) {
    return (next) => (action) => {
      if (!!action.uiStartLoading) {
        vm.uiActions.incrementLoading(action.uiStartLoading);
      }
      if (!!action.uiEndLoading) {
        vm.uiActions.decrementLoading(action.uiEndLoading);
      }
      if (!!action.toastr) {
        vm.toastr.info(action.toastr);
      }
      return next(action);
    };
  };
}
```


Avoiding reloading

selector-helpers

