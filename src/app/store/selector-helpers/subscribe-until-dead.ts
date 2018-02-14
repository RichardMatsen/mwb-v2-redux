import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

/*
  Usage notes:
  This is a wrapper for subscribe to ensure subscriptions in a component finish when the component is destroyed.
  Note, when using AOT compiler (or on Plunkr) the ngOnDestroy lifecycle hook needs to be explicitly added to the component.
  Given that constraint, it is more straight-forward to simply save the subscription and call unsubscribe() on it in ngOnDestroy.
*/
const subscribe2 = function(component, fnData, fnError = null, fnComplete = null) {

  // Define the subscription
  const sub: Subscription = this.subscribe(fnData, fnError, fnComplete);

  // Wrap component's onDestroy
  if (!component.ngOnDestroy) {
    throw new Error('To use subscribe2, the component must implement ngOnDestroy');
  }
  const saved_OnDestroy = component.ngOnDestroy;
  component.ngOnDestroy = () => {
    sub.unsubscribe();
    // Note: need to put original back in place
    // otherwise 'this' is undefined in component.ngOnDestroy
    component.ngOnDestroy = saved_OnDestroy;
    component.ngOnDestroy();
  };

  return sub;
};

// Create an Observable extension
Observable.prototype.subscribe2 = subscribe2;

// Ref: https://www.typescriptlang.org/docs/handbook/declaration-merging.html
declare module 'rxjs/Observable' {
  interface Observable<T> {
    subscribe2: typeof subscribe2;
  }
}
