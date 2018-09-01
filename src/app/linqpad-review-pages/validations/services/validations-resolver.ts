import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { select } from 'app/store/store.service';
import { IFileInfo } from 'app/model/fileInfo.model';
import { ValidationsDataService } from './validations-data.service';
import { ifNull } from 'app/store/selector-helpers/selector-helpers';

@Injectable()
export class ValidationsResolver implements Resolve<any> {

  public PAGE = 'validations';
  @select(['pages', 'validations', 'files']) files$: Observable<IFileInfo[]>;

  constructor(
    private dataService: ValidationsDataService
  ) {}

  resolve() {
    ifNull(this.files$, () => {
      this.dataService.initializeList();
    });
  }
}
