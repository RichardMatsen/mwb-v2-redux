import { Injectable,  } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../store/state/AppState';
import { UiActionType } from '../../store/state/action-types';

@Injectable()
export class UiActions {

  static INCREMENT_LOADING = '[UI] INCREMENT_LOADING';
  static DECREMENT_LOADING = '[UI] DECREMENT_LOADING';
  static FOUR0FOUR_MESSAGE = '[UI] FOUR0FOUR_MESSAGE';

  constructor(
    private ngRedux: NgRedux<IAppState>,
  ) {}

  createIncrementLoading(trigger: string): UiActionType {
    return {
      type: UiActions.INCREMENT_LOADING,
      trigger: trigger,
      excludeFromLog: true,
    };
  }
  incrementLoading(trigger: string) {
    this.ngRedux.dispatch(this.createIncrementLoading(trigger));
  }

  createDecrementLoading(trigger: string): UiActionType {
    return {
      type: UiActions.DECREMENT_LOADING,
      trigger: trigger,
      excludeFromLog: true,
    };
  }
  decrementLoading(trigger: string) {
    this.ngRedux.dispatch(this.createDecrementLoading(trigger));
  }

  createSetFour0FourMessage(caller, message, url, methodArgs): UiActionType {
    return {
      type: UiActions.FOUR0FOUR_MESSAGE,
      payload: {
        four0four: {
          caller,
          message,
          url,
          methodArgs
        }
      }
    };
  }
  setFour0FourMessage(caller, message, url, methodArgs) {
    this.ngRedux.dispatch(this.createSetFour0FourMessage(caller, message, url, methodArgs));
  }

}
