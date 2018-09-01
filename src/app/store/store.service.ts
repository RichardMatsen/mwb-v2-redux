import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NgRedux, select as selectDecorator, Selector, Comparator } from '@angular-redux/store';

import { IAppState } from 'app/store/state/AppState';
import { Actions } from './actions/actions';
import { Computed } from './computed/computed-properties';

export interface storeType {
  actions: Actions,
  computed: Computed,
  dispatch: any,
  getState: () => IAppState,
  select: <SelectedType>(selector?: Selector<IAppState, SelectedType>, comparator?: Comparator) => Observable<SelectedType>
};

const select: <T>(selector?: Selector<any, T>, comparator?: Comparator) => PropertyDecorator = selectDecorator; // the decorator form

@Injectable()
export class StoreService {

  constructor(
    private ngRedux: NgRedux<IAppState>,
    public actions: Actions,
    public computed: Computed
  ) {}

  dispatch(action): any {
    return this.ngRedux.dispatch(action);
  }

  getState(): IAppState {
    return this.ngRedux.getState();
  }

  select<T>(selector?: Selector<any, T>, comparator?: Comparator): Observable<T> {
    return this.ngRedux.select(selector, comparator);
  }

}
export { select };  // the decorator form
