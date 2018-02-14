import '../../rxjs-extensions';
import { Observable } from 'rxjs/Observable';
import { IFileInfo } from '../../model/FileInfo';

const newFiles$ = function(oldList: IFileInfo[]) {
  return this.filter(file => oldList.map(v => v.name).indexOf(file.name) === -1);
};

const mergeWithExisting$ = function(oldList: IFileInfo[]) {
  return this.merge(Observable.from(oldList));
};

const sort$ = function(comparer) {
  return this.toArray().concatMap(array => array.sort(comparer));
};

const sequenceDisplay$ = function(sequencer) {
  return this.scan((previous, current) => { sequencer(previous, current); return current; }, null);
};

const doAsArray$ = function(action) {
  return this.toArray().mergeMap(array => action(array));
};

Observable.prototype.newFiles$ = newFiles$;
Observable.prototype.mergeWithExisting$ = mergeWithExisting$;
Observable.prototype.sort$ = sort$;
Observable.prototype.doAsArray$ = doAsArray$;
Observable.prototype.sequenceDisplay$ = sequenceDisplay$;

declare module 'rxjs/Observable' {
  interface Observable<T> {
    newFiles$: typeof newFiles$;
    mergeWithExisting$: typeof mergeWithExisting$;
    sort$: typeof sort$;
    sequenceDisplay$: typeof sequenceDisplay$;
    doAsArray$: typeof doAsArray$;
  }
}
