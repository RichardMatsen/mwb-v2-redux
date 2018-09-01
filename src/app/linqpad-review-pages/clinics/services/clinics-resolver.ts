import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { select } from 'app/store/store.service';
import { IFileInfo } from 'app/model/fileInfo.model';
import { ClinicsDataService } from './clinics-data.service';
import { ifNull } from 'app/store/selector-helpers/selector-helpers';

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
