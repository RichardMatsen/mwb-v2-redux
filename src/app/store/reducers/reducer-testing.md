
# Reducer Testing

Since reducers are pure functions, a reducer test is fairly straight forward. It should not require mocks or Angular TestBed to provide DI build of components.  
However, since there are a lot of actions in a moderate size application, and actions can update multiple items of state, the tests are verbose and also brittle if actions and state are refactored.

## Shaping Actions and Reducers for Better Tests.
The effort in testing reducers can be dramatically reduced by adopting certain conventions:
- The payload property of the action should have properties that correspond exactly to the propeties of the state slice being updated.
- The reducer code should be as dumb as possible. Logic in the reducer (translating property name, deriving property values) should be moved to the action.
- Actions should have two methods apiece - one that creates the action (for use in tests), and another that dispatches the action (called from application code).
  ```javascript
  createChangeFile(fileInfo: IFileInfo): ActionType {
    return {
      type: PageActions.CHANGE_FILE,
      payload: {
        ...
      },
    };
  }
  changeFile(fileInfo: IFileInfo) {
    this.ngRedux.dispatch( this.createChangeFile(fileInfo) );
  }
  ```

## Generic Action Handler  
With these conventions, the only work required on the reducer is generic, just assigning action.payload properties to corresopnding state properties.   

```javascript
export function genericActionHandler(state, action) {
  if (!action.payload) {
    return state;
  }
  let newState = {...state};
  const updated = Object.assign(newState, action.payload);
  return updated;
}
```

## Testing the Reducer
The test then consists of comparing state properties to action.resolved.
```javascript
function checkPageReducer(action) {
  const priorState = {...testState};
  const afterState = pageReducer(testState, action);

  if (action.payload) {
    expect(afterState).toHaveProperties(action.payload);
    expect(afterState).not.toEqual(priorState);  // Object properties have changed
  } else {
    expect(afterState).toEqual(priorState);      // Object properties have not changed
    expect(afterState).toBe(testState);          // Object ref has not changed
  }
}
```

## Testing Immutability
As well as setting state, the reducer should maintain immutability. This check is simple also.
```javascript
function checkPageImmutable(action) {
  const afterState = pageReducer(testState, action);
  if (action.payload) {
    expect(afterState).not.toBe(testState);      // Object ref has changed
  } else {
    expect(afterState).toBe(testState);          // Object ref has not changed
  }
}
```

## Reducer Sub-State   
Some additional functionality comes into play in this application's **page-reducer**.   
Since page-reducer's code is common to the validations, referentials, and clinics pages, we pass it the state slice below and the action contains the page name to be changed in **action.subState**.  
Only that sub-state of the reducer's state slice is updated.
```javascript
export interface IPageStateRoot {
  validations?: IPageState;
  referentials?: IPageState;
  clinics?: IPageState;
}
```  
Therefore, in the test spec an additonal check ensures that other page data remains unchanged, and in fact the same objects. (Note, the test updates the 'validations' page data).  
```javascript
function checkOtherPageState(action: ActionType) {
  const afterState = pageReducer(testState, action);
  expect(afterState.referentials).toBe(testState.referentials);
  expect(afterState.clinics).toBe(testState.clinics);
}
```
## The Testing Loop
With the above pieces, the actual tests can be data driven.  
By using the action creators to provide the shape of the action (instead of constructing the action explicitly in the test), we remove most of the brittleness of the tests.  
That is, we can change state and actions as features require and the test still works.

```javascript
const actionsToTest = [
  { action: pageActions.createInitializeListRequest() },
  { action: pageActions.createInitializeListSuccess(files, 1) },
  { action: pageActions.createInitializeListFailed('an error') },
  { action: pageActions.createUpdateListRequest() },
  { action: pageActions.createUpdateListSuccess(files, 1) },
  { action: pageActions.createUpdateListFailed('error occurred') },
  { action: pageActions.createSetNumToDisplay(1) },
  { action: pageActions.createChangeFile(files[1]) },
  { action: pageActions.createRefresh(files[0]) },
  { action: pageActions.createSetLastRefresh() },
]

actionsToTest.forEach(actionToTest => {
  let cleanAction;  // Reset before each, since action.type is changed in reducer
  beforeEach(() => {
    cleanAction = Object.assign({}, actionToTest.action);
  })

  describe(actionToTest.actionType, () => {
    it(`should add payload to state`, () => {
      checkPageReducer(cleanAction);
    });
    it(`should not affect other pages`, () => {
      checkOtherPageState(cleanAction);
    });
    it(`should not mutate target page`, () => {
      checkPageImmutable(cleanAction);
    });
  });

})
```

## Type Safety in Actions

One remaining source of bugs not covered by the test is invalid properties in the action payload properties. To avoid these, we define types for each state slice and use them in both the state definition and in action creators.

**In the State definition:**
```javascript
export type PageState = {
  files?: IFileInfo[],
  fileInfo?: IFileInfo,
  lastRefresh?: string,
  fileCount?: number,
  numVisible?: number,
  visibleFiles?: IFileInfo[],
  error?: any
}

export type PageStateRoot = {
  validations?: PageState;
  referentials?: PageState;
  clinics?: PageState;
}

export interface IAppState {
  pages?: PageStateRoot;
  ...
}
```
**In the Action Type definition:**
```javascript
export type PageActionType = {
  type: string,
  payload?: PageState,  // Constrain the payload properties to match state
  ...
} 
```
**In the Action Creators:**
```javascript
createChangeFile(fileInfo: IFileInfo): PageActionType {
  return {
    type: PageActions.CHANGE_FILE,
    subState: this.PAGE,
    payload: {
      fileInfo,
      unknownProp: 'not valid'    // Compile time error
    },
  };
}
```
