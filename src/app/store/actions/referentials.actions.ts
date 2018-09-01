import { Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';

import { IAppState } from 'app/store/state/AppState';
import { IFileInfo } from 'app/model/fileInfo.model';
import { PageActions } from 'app/store/actions/page.actions';

@Injectable()
export class ReferentialsActions extends PageActions {

  public PAGE = 'referentials';
  @select(['pages', 'referentials', 'fileInfo']) fileInfo$: Observable<IFileInfo>;

  constructor(
    protected ngRedux: NgRedux<IAppState>,
  ) {
    super(ngRedux);
  }
}
