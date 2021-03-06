import { Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';

import { IAppState } from '../../../store/state/AppState';
import { IFileInfo } from '../../../model/FileInfo';
import { PageActions } from '../../common/page.actions';

@Injectable()
export class ClinicsActions extends PageActions {

  public PAGE = 'clinics';
  @select(['pages', 'clinics', 'fileInfo']) fileInfo$: Observable<IFileInfo>;

  constructor(
    protected ngRedux: NgRedux<IAppState>,
  ) {
    super(ngRedux);
  }
}
