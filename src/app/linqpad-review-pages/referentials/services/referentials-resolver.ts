import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { select } from '@angular-redux/store';

import { IFileInfo } from '../../../model/fileInfo.model';
import { ReferentialsDataService } from './referentials-data.service';
import { ifNull } from '../../../store/selector-helpers/selector-helpers';

@Injectable()
export class ReferentialsResolver implements Resolve<any> {

  public PAGE = 'referentials';
  @select(['pages', 'referentials', 'files']) files$: Observable<IFileInfo[]>;

  constructor(
    private dataService: ReferentialsDataService
  ) {}

  resolve() {
    ifNull(this.files$, () => {
      this.dataService.initializeList();
   });
  }
}
