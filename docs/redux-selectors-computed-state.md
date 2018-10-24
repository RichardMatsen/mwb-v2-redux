## Redux Selectors - Computed State

Computed state properties are functions on stored state which provide alternate, filtered, or aggregate views.  They are useful because they allow the amount of data stored in state to be kept to a minimum. 

The redux library `angular-redux/store` does not explicitly implement computed state in the same way as other libraries, but achieves it via `@select()` and `@select$()` decorators (ref: [The Select Pattern](https://github.com/angular-redux/store/blob/master/articles/select-pattern.md)).  

The problem is, the code for these selectors is not centralized. Examples given in docs show each component or service implementing the computation code. However, it would be preferable to defined the logic once on the store.  

For example, the `visibleFiles` property is used on both the **page component** and the **search component**, so it would be useful to define the calculation in one place. 

This can be done by creating a `Computed` class and injecting it into components and services as needed. Note that some _'properties'_ are implemented as methods since we need to pass in the `page` parameter. The result is a higher-order function similar to the pattern for Middleware.

This is possible, since a ***Selector*** can be a function - from the [source](https://github.com/angular-redux/store/blob/master/src/components/selectors.ts)

```javascript
export type FunctionSelector<RootState, S> = ((s: RootState) => S);
export type Selector<RootState, S> =
  | PropertySelector
  | PathSelector
  | FunctionSelector<RootState, S>;
```

### Computed class

```javascript
@Injectable()
export class Computed {

  constructor(private ngRedux: NgRedux<IAppState>) {}

  visibleFiles$(page): Observable<IFileInfo[]> {
    return this.ngRedux.select<IFileInfo[]>(this.visibleFiles(page));
  }

  private visibleFiles = (page) => (state) => {
    const files = state.pages[page].files || [];
    const numVisible = state.pages[page].numVisible || 0;
    return files.slice(0, numVisible);
  }
  ...
}
```

### Usage

```javascript
  private getResults(searchTerm) {
    this.computed.visibleFiles$(this.page)
      .take(1)
      .map(files => ...
  }
```

---------------------------------------
