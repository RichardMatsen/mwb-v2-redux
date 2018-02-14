import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';

import { ReferentialsActions } from './services/referentials.actions';
import { ReferentialsDataService } from './services/referentials-data.service';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'mwb-referentials',
  template: `
    <page-common  [config]="config | async" [PAGE]="PAGE" [services]="services">
      <app-referentials-diagram banner-button #diagramModal></app-referentials-diagram>
    </page-common>
  `,
  styleUrls: ['referentials.component.css'],
})
export class ReferentialsComponent {

  public readonly PAGE = 'referentials';
  @select(['config', 'referentialsConfig', 'page']) config: any;
  services = { actions: this.actions, dataService: this.dataService };

  constructor(
    private actions: ReferentialsActions,
    private dataService: ReferentialsDataService,
    private sharedDataService: SharedDataService,
  ) {}

  ngOnInit() {
  }

}
