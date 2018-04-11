## Redux Selectors

## Computed State

Computed state properties are functions on stored state to provide alternate, filtered, or aggreagate views.  They are useful because they allow the amount of data stored in state to be kept to a minimum. 

The redux library `angular-redux/store` does not explicitly implement computed state in the same way as other libraries, but achieves it via `@select()` and `@select$()` decorators (ref: [The Select Pattern](https://github.com/angular-redux/store/blob/master/articles/select-pattern.md)).  

The problem is, the code for these selectors is not centralized. Examples given in docs show each component or service implementing the computation code. However, it would be preferable to defined the logic once on the store.  

For example, the `visibleFiles` property is used on both the **page component** and the **search component**, so it would be useful to define the calculation in one place. 

This can be done by creating a `Computed` class and injecting it into components and services as needed. Note that some _'properties'_ are implemented as methods since we need to pass in the `page` parameter. The result is a higher-order function similar to the pattern for Middleware.

**Computed class**

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

**Usage**
```javascript
  private getResults(searchTerm) {
    this.computed.visibleFiles$(this.page)
      .take(1)
      .map(files => ...
  }
```

<hr/>

## Selector Helpers

Two problem occur frequently when loading resources for a page
- multiple resources need to be loaded ***in order***, so the second resource may depend on the asynchronous loading of a first resource. 
- resource loading may be initiated from more than one URL, but we want to avoid reloading if already present.

These can be handled with RxJS `.filter()` and `.take(1)` operators on a Redux store selector.  

To make the usage a bit clearer we can encapsulate them in functions with callback, or by creating custom operators, 

### **Functional callbacks**

```javascript
export function waitfor<T>(selector$: Observable<T>, fnOnData, fnOnError = null) {
  selector$
    .filter(data => !!data)
    .take(1)
    .subscribe(
      (data) => { fnOnData(data); },
      (error) => { console.error(error); if (fnOnError) { fnOnError(error); } }
    );
}

export function ifNull<T>(selector$: Observable<T>, fnWhenNoData, fnOnError = null) {
  selector$
    .take(1)
    .filter(data => data === null || data === undefined)
    .subscribe(
      (falsyData) => { fnWhenNoData(falsyData); },
      (error) => { console.error(error); if (fnOnError) { fnOnError(error); } }
    );
}
```
 
### **Custom operators**

```javascript
import { Observable } from 'rxjs/Observable';

export const waitFor$ = function() {
  return this
    .filter(data => !!data )
    .take(1);
};

export const ifNull$ = function() {
  return this.take(1)
    .filter(data => data === null || data === undefined);
};

Observable.prototype.waitFor$ = waitFor$;
Observable.prototype.ifNull$ = ifNull$;

declare module 'rxjs/Observable' {
  // tslint:disable-next-line:no-shadowed-variable
  interface Observable<T> {
    waitFor$: typeof waitFor$;
    ifNull$: typeof ifNull$;
  }
}
```

### **Example usage**

**Callback syntax**

```javascript  
public initializeMeasures() {
  ifNull(this.measures$, () => {
    this.measureActions.initializeMeasuresRequest();
    ...
  });
}
```
**Fluent syntax**

```javascript  
private getMeasures(): Observable<IMeasure[]> {
  return this.baseDataUrl$
    .waitFor$()
    .mergeMap(baseDataUrl => ...
}
```
<hr/>

