import { Component } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';

import { ValidationsActions } from './services/validations.actions';
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
