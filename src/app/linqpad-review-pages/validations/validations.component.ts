import { Component } from '@angular/core';

import { select } from 'app/store/store.service';
import { ValidationsActions } from 'app/store/actions/validations.actions';
import { ValidationsDataService } from './services/validations-data.service';

@Component({
  selector: 'mwb-validations',
  template: `<mwb-page-common  [config]="config | async" [PAGE]="PAGE" [services]="services"></mwb-page-common>`,
})
export class ValidationsComponent {

  public readonly PAGE = 'validations';
  @select(['config', 'validationsConfig', 'page']) config: any;
  services = { actions: this.actions, dataService: this.dataService };

  constructor(
    private actions: ValidationsActions,
    private dataService: ValidationsDataService,
  ) {}

}
