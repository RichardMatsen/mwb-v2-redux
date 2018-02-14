import { Component } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';

import { ClinicsActions } from './services/clinics.actions';
import { ClinicsDataService } from './services/clinics-data.service';

@Component({
  selector: 'mwb-clinics',
  template: `<page-common  [config]="config | async" [PAGE]="PAGE" [services]="services"></page-common>`,
})
export class ClinicsComponent {

  public readonly PAGE = 'clinics';
  @select(['config', 'clinicsConfig', 'page']) config: any;
  services = { actions: this.actions, dataService: this.dataService };

  constructor(
    private actions: ClinicsActions,
    private dataService: ClinicsDataService
  ) {}

}
