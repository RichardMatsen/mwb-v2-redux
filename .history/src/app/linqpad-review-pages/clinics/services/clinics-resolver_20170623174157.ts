import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { select } from '@angular-redux/store';

import { IFileInfo } from '../../../model/FileInfo';
import { ClinicsDataService } from './clinics-data.service';
import { ifNull } from '../../../store/selector-helpers/selector-helpers';

@Injectable()
export class ClinicsResolver implements Resolve<any> {

  public PAGE = 'clinics';
  @select(['pages', 'clinics', 'files']) files$: Observable<IFileInfo[]>;

  constructor(
    private dataService: ClinicsDataService,
  ) {}

  resolve() {
    ifNull(this.files$, () => {
      this.dataService.initializeList();
    });
  }
}
