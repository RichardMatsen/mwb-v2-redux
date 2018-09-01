import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { select } from 'app/store/store.service';
import { IFileInfo } from 'app/model/fileInfo.model';
import { ReferentialsDataService } from './referentials-data.service';
import { ifNull } from 'app/store/selector-helpers/selector-helpers';

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
