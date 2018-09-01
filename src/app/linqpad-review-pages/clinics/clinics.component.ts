import { Component } from '@angular/core';

import { StoreService, select } from 'app/store/store.service';
import { ClinicsDataService } from './services/clinics-data.service';

@Component({
  selector: 'mwb-clinics',
  template: `<mwb-page-common  [config]="config | async" [PAGE]="PAGE" [services]="services"></mwb-page-common>`,
})
export class ClinicsComponent {

  public readonly PAGE = 'clinics';
  @select(['config', 'clinicsConfig', 'page']) config: any;
  services = { actions: this.store.actions.clinicsActions, dataService: this.dataService };

  constructor(
    private store: StoreService,
    private dataService: ClinicsDataService
  ) {}

}
