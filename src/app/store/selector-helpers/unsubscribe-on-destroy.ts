import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Subscriber } from 'rxjs/Subscriber';
import { Observer } from 'rxjs/Observer';

/*
  Usage notes:
  This decorator unsubscribes from store subscriptions which otherwise might continue to fire
  after the component is destroyed.
  It requires the subscription to be saved onto the component.
  Note, when using AOT compiler (or on Plunkr) the ngOnDestroy lifecycle hook needs to be explicitly added to the component.
  Given these constraints, it is more straight-forward to simply call subscription.unsubscribe() in ngOnDestroy.
*/
export function UnsubscribeOnDestroy() {

  return function (target) {

    const saved_ngOnDestroy = target.prototype.ngOnDestroy;

    target.prototype.ngOnDestroy = function () {
      Object.keys(this).map(key => {
        const val = this[key];
        if (val instanceof Subscription) {
          val.unsubscribe();
        }
      });
      if (saved_ngOnDestroy && typeof saved_ngOnDestroy === 'function') {
        saved_ngOnDestroy.apply(this, arguments);
      }
    };
  };

}
