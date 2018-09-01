## Redux Middleware

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
The **spinner component template** is conditionally shown depending on the store property `activeRequests`.   

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
  static INITIALIZE_MEASURES_FAILED  = 'INITIALIZE_MEASURES_FAILED';
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

### UI middleware type and factory

```javascript
export type UiActionType = {
  type: string,
  payload?: UiState,          // Constrain payload to match UiState
  trigger?: string,           // Show which action triggered this action
  excludeFromLog?: boolean,   // Devtools enhancer will filter from the log
  message?: string,           // Message to display on the 404 screen
};

uiMiddlewareFactory() {
  const vm = this;
  return function uiMiddleware(store) {
    return (next) => (action) => {
      if (action.uiStartLoading) {
        vm.uiActions.incrementLoading(action.type);
      }
      if (action.uiEndLoading) {
        vm.uiActions.decrementLoading(action.type);
      }
      if (!!action.toastr) {
        vm.toastr.info(action.toastr);
      }
      return next(action);
    };
  };
}
```
