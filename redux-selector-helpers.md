# Redux Selector Helpers

Two problem occur frequently when loading resources for a page
- multiple resources need to be loaded ***in order***, so the second resource may depend on the asynchronous loading of a first resource. 
- resource loading may be initiated from more than one URL, but we want to avoid reloading if already present.

These can be handled with RxJS `.filter()` and `.take(1)` operators on a Redux store selector.  

To make the usage a bit clearer we can encapsulate them in functions with callback, or by creating custom operators, 

#### Functional callbacks

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
 
#### Custom operators

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

#### Example usage

```javascript  
public initializeMeasures() {
  ifNull(this.measures$, () => {
    this.measureActions.initializeMeasuresRequest();
    this.getMeasures()
      .subscribe(
        (measures) => { this.measureActions.initializeMeasuresSuccess(measures); },
        (error) => { this.measureActions.initializeMeasuresFailed(error); },
      );
  });
}

private getMeasures(): Observable<IMeasure[]> {
  return this.baseDataUrl$
    .waitFor$()
    .mergeMap(baseDataUrl => {
      const url = baseDataUrl + 'InitialMeasures.json';
      return this.http.get(url)
        .map(response => response.json().measures)
        .catch(error => this.handleError(error, 'getInitialMeasures'));
    });
}
```
