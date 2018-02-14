import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { select } from '@angular-redux/store';

import { IFileInfo } from '../../../model/FileInfo';
import { ValidationsDataService } from './validations-data.service';
import { ifNull } from '../../../store/selector-helpers/selector-helpers';

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
