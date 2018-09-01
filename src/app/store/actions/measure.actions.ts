import { Injectable,  } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NgRedux } from '@angular-redux/store';

import { IAppState } from 'app/store/state/AppState';
import { IMeasure, IMeasureUpdate } from 'app/model/measure.model';

export interface MeasureActionType {
  type: string;
  uiStartLoading?: boolean;
  uiEndLoading?: boolean;
  excludeFromLog?: boolean;
  payload?: { measures: IMeasure[]} ;
}

@Injectable()
export class MeasureActions {

  static INITIALIZE_MEASURES_REQUEST = 'INITIALIZE_MEASURES_REQUEST';
  static INITIALIZE_MEASURES_SUCCESS = 'INITIALIZE_MEASURES_SUCCESS';
  static INITIALIZE_MEASURES_FAILED = 'INITIALIZE_MEASURES_FAILED';
  static UPDATE_MEASURE = 'UPDATE_MEASURE';
  static ACTIONS = [
    MeasureActions.INITIALIZE_MEASURES_REQUEST,
    MeasureActions.INITIALIZE_MEASURES_SUCCESS,
    MeasureActions.INITIALIZE_MEASURES_FAILED,
    MeasureActions.UPDATE_MEASURE
  ];

  public errorMeasure = (error) => ({ id: 'err', title: `Error loading measures: ${error}`, icon: 'fa-exclamation-triangle' });

  constructor(
    private ngRedux: NgRedux<IAppState>,
  ) {}

  createInitializeMeasuresRequest(): MeasureActionType {
    return {
      type: MeasureActions.INITIALIZE_MEASURES_REQUEST,
      uiStartLoading: true,
      excludeFromLog: true,
    };
  }
  initializeMeasuresRequest() {
    this.ngRedux.dispatch(this.createInitializeMeasuresRequest());
  }

  createInitializeMeasuresSuccess(measures: IMeasure[]): MeasureActionType {
    return {
      type: MeasureActions.INITIALIZE_MEASURES_SUCCESS,
      uiEndLoading: true,
      payload: { measures }
    };
  }
  initializeMeasuresSuccess(measures: IMeasure[]) {
    this.ngRedux.dispatch(this.createInitializeMeasuresSuccess(measures));
  }

  createInitializeMeasuresFailed(error) {
    return {
      type: MeasureActions.INITIALIZE_MEASURES_FAILED,
      uiEndLoading: MeasureActions.INITIALIZE_MEASURES_FAILED,
      payload: { measures: [this.errorMeasure(error)] }
    };
  }
  initializeMeasuresFailed(error) {
    this.ngRedux.dispatch(this.createInitializeMeasuresFailed(error));
  }

  createUpdateMeasure(measureUpdate: IMeasureUpdate) {
    return {
      type: MeasureActions.UPDATE_MEASURE,
      payload: {
        measureUpdate,
      }
    };
  }
  updateMeasure(measureUpdate: IMeasureUpdate) {
    this.ngRedux.dispatch(this.createUpdateMeasure(measureUpdate));
  }

}
