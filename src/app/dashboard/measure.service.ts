import '../rxjs-extensions';
import { Injectable} from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { StoreService, select } from 'app/store/store.service';
import { IMeasure, IMeasureUpdate } from '../model/measure.model';
import { IAppState } from '../store/state/AppState';
import { ValidationsDataService } from '../linqpad-review-pages/validations/services/validations-data.service';
import { ReferentialsDataService } from '../linqpad-review-pages/referentials/services/referentials-data.service';
import { ClinicsDataService } from '../linqpad-review-pages/clinics/services/clinics-data.service';
import { ifNull } from '../store/selector-helpers/selector-helpers';
import { IFileInfo } from '../model/fileInfo.model';

@Injectable()
export class MeasureService {

  @select('measures') measures$: Observable<IMeasure[]>;
  @select('pages') pages$: Observable<any>;
  @select(['config', 'baseDataUrl']) baseDataUrl$: Observable<string>;

  constructor(
    private http: Http,
    private validationsDataService: ValidationsDataService,
    private referentialsDataService: ReferentialsDataService,
    private clinicsDataService: ClinicsDataService,
    private store: StoreService
  ) {}

  public initializeMeasures() {
    ifNull(this.measures$, () => {
      this.store.actions.measureActions.initializeMeasuresRequest();
      this.getMeasures()
        .subscribe(
          (measures) => { this.store.actions.measureActions.initializeMeasuresSuccess(measures); },
          (error) => { this.store.actions.measureActions.initializeMeasuresFailed(error); },
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

  public updateMeasures() {
    this.measures$
      .waitFor$()
      .subscribe( measures => {
        this.getAllMeasureUpdates()
          .subscribe(measureUpdate => {
            if (this.hasChanged(measures, measureUpdate)) {
              this.store.actions.measureActions.updateMeasure(measureUpdate);
            }
          });
      });
  }

  private hasChanged(prevMeasures, newMeasure) {
    const oldState = prevMeasures.find(m => m.id === newMeasure.id);
    return !oldState || oldState.metric !== newMeasure.metric || oldState.color !== newMeasure.color;
  }

  private getAllMeasureUpdates(): Observable<IMeasureUpdate> {
    const validationMeasure$ = this.getMeasure('validations', this.validationsDataService).take(1);
    const referentialsMeasure$ = this.getMeasure('referentials', this.referentialsDataService).take(1);
    const clinicsMeasure$ = this.getMeasure('clinics', this.clinicsDataService).take(1);
    return validationMeasure$.concat(referentialsMeasure$, clinicsMeasure$);
  }

  private getMeasure(measureId, dataService): Observable<IMeasureUpdate> {
    const filesSelector$ = this.store.select<IFileInfo[]>(['pages', measureId, 'files']);
    ifNull(filesSelector$, () => {
      dataService.initializeList();
    });
    return filesSelector$
      .waitFor$()
      .mergeMap(files => {
        return dataService.getMeasure();
      });
  }

  private handleError(error: any, method: string, methodArgs = null) {
    const msg = `${this.constructor.name}.${method}: ${error}. Method args: ${JSON.stringify(methodArgs)}`;
    console.error(msg);
    return Observable.throw(error);
  }

}
