## Redux Selectors - Processing with array flattening

A problem occurs when using a Redux selector as source for an RxJS chain of operators, if it includes any that require a ***completed*** notification (e.g, `forkJoin`, `toArray`, `count`), the pipeline will fail silently.

The problem is that Redux selectors do not emit a complete notification, since they are intended to continuously update components as and when state changes.

There are a few ways to handle this.

#### #1 - Use take() to add a completed notification at the source

If the component only needs a single value, use `take(1)` at source to add the completed notification.  

If the store element is being populated asynchronously, the take should be applied after a `filter(x => !!x)` which will yield the first non-null value (Note the initial state should be set to `null`).  

The filter / take sequence is used in the `waitFor$()` custom operator,

```javascript
export const waitFor$ = function(fn = null) {
  fn = fn || (data => !!data);
  return this
    .filter(fn)
    .take(1);
};
```

#### #2 - Use takeWhile to restore a flattened Observable<any[]>  

When an Observable of array needs to process individual elements, and the result of the process is itself Observable (see below, fetching file contents), the steps need to be  

- convert `Observable<any[]>` to `Observable<any>` with `mergeMap(x => x)`
- process and return `Observable<another>` with `mergeMap` or `concatMap`
- use `toArray` to return to array processing, i.e `Observable<another[]>`

The problem is again a lack of completed notification. This can be added using `takeWhile()` to check against the array length (`take(n)` does not work).

```javascript
private withContent$(files$: Observable<IFileInfo[]>, numToInitialize: number): Observable<IFileInfo[]> {
  let count;
  return files$
    .do(array => count = array.length)
    .mergeMap(files => files)
    .concatMap((file, index) =>
      file.content || index >= numToInitialize
        ? Observable.of(file)
        : this.getContent(file)
    )
    .takeWhile((x, index) => index < count)
    .toArray()
    .catch(error => this.handleError(error, 'getContentForList$'));
}
```

or

```javascript
private withContent$(files$: Observable<IFileInfo[]>, numToInitialize: number): Observable<IFileInfo[]> {
  return files$.mergeMap(files => {
    const count = files.length;
    return Observable.from(files)
      .concatMap((file, index) =>
        file.content || index >= numToInitialize
          ? Observable.of(file)
          : this.getContent(file)
      )
      .takeWhile((x, index) => index < count)
      .toArray()
      .catch(error => this.handleError(error, 'withContent$'));
    });
}
```

#### #3 - Use scan to aggregate item count or back to an array

`scan()` can gather values emitted into an array, but does not require a complete notification.  It will emit each version of the array with 1,2,3 etc elements, so should be followed by a filter to take just the last emit.

```javascript
private withContent$(files$: Observable<IFileInfo[]>, numToInitialize: number): Observable<IFileInfo[]> {
  let count;
  return files$
    .do(array => count = array.length)
    .mergeMap(files => files)
    .concatMap((file, index) =>                   // Use concatMap to preserve ordering
      file.content || index >= numToInitialize
        ? Observable.of(file)
        : this.getContent(file)
    )
    .scan((acc, x, i) => [...acc, x], [])
    .filter(array => array.length === count)
    .catch(error => this.handleError(error, 'getContentForList$'));
}
```

#### #4 - Use forkJoin to aggregate inner observables

`forkJoin` waits for a list of observables to resolve, and returns them as an Observable array. With this operator, we don't need to specifically know the array length. However, there are two caveats

- all the inner observables must complete 
- if one inner errors, forkJoin will error ***unless*** there is error handling on every inner observable, such that the error is swallowed

```javascript
private withContent$(files$: Observable<IFileInfo[]>, numToInitialize: number): Observable<IFileInfo[]> {
  return files$.concatMap(files => {
    const withContent$ = files.map((file, index) => {
      return file.content || index >= numToInitialize
        ? Observable.of(file)
        : this.getContent(file);
    });
    return forkJoin(...withContent$);
  })
  .catch(error => this.handleError(error, 'getContentForList$'));
}
```
