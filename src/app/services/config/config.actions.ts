import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from 'redux';
import { NgRedux, select, } from '@angular-redux/store';
import { ObjectShapeComparer } from '../../common/object-shape-comparer/object-shape-comparer';

import { IAppState } from '../../store/state/AppState';

@Injectable()
export class ConfigActions {

  static INITIALIZE_CONFIG_REQUEST = 'INITIALIZE_CONFIG_REQUEST';
  static INITIALIZE_CONFIG_SUCCESS = 'INITIALIZE_CONFIG_SUCCESS';
  static INITIALIZE_CONFIG_FAILED  = 'INITIALIZE_CONFIG_FAILED';
  static INITIALIZE_CONFIG_TEMPLATE_ERROR  = 'INITIALIZE_CONFIG_TEMPLATE_ERROR';
  static ACTIONS = [ConfigActions.INITIALIZE_CONFIG_REQUEST,
                    ConfigActions.INITIALIZE_CONFIG_SUCCESS,
                    ConfigActions.INITIALIZE_CONFIG_FAILED];

  configTemplate;
  pageConfigTemplate;

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private objectShapeComparer: ObjectShapeComparer,
  ) {
    this.initTemplates();
  }

  initTemplates() {

    this.pageConfigTemplate = {
      pageTitle: '',
      pageDescription: '',
      listTitle: '',
      listWidth: 0,
      badgeUnits: '',
      resultsZoom: ''
    };

    this.configTemplate = {
      baseDataUrl: '',
      validationsConfig: {
        filePrefixes: [],
        numDataPointsForSparkline: 0,
        numInitialFilesToDisplay: 0,
        page: this.pageConfigTemplate
      },
      referentialsConfig: {
        filePrefixes: [],
        daysToInitialize: 0,
        daysToDisplay: 0,
        page: this.pageConfigTemplate
      },
      clinicsConfig: {
        filePrefixes: [],
        numDataPointsForSparkline: 0,
        numInitialFilesToDisplay: 0,
        page: this.pageConfigTemplate
      }
    };
  }

  createInitializeConfigRequest() {
    return {
      type: ConfigActions.INITIALIZE_CONFIG_REQUEST,
      httpRequest: {
        url: 'migration-workbench.config.json',
        successAction: this.createInitializeConfigSuccess,
        failedAction: this.createInitializeConfigFailed,
        validateResponse: (data) => this.checkTemplate(data)
      }
    };
  }
  initializeConfigRequest() {
    this.ngRedux.dispatch( this.createInitializeConfigRequest() );
  }

  createInitializeConfigSuccess(data) {
    const payload = data;
    return {
      type: ConfigActions.INITIALIZE_CONFIG_SUCCESS,
      payload
    };
  }

  createInitializeConfigFailed(error) {
    return {
      type: ConfigActions.INITIALIZE_CONFIG_FAILED,
      payload: {
        error
      }
    };
  }

  checkTemplate(data): boolean {
    const results = this.objectShapeComparer.compare(this.configTemplate, data);
    if (results.length === 0) {
      return true;
    }
    results.forEach(result => {
      this.ngRedux.dispatch({
        type: ConfigActions.INITIALIZE_CONFIG_TEMPLATE_ERROR,
        data: result,
      });
    });
    return false;
  }

}
