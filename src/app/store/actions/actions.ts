import { Injectable,  } from '@angular/core';

import { ConfigActions } from 'app/store/actions/config.actions';
import { MeasureActions } from 'app/store/actions/measure.actions';
import { ClinicsActions } from 'app/store/actions/clinics.actions';
import { ValidationsActions } from 'app/store/actions/validations.actions';
import { ReferentialsActions } from 'app/store/actions/referentials.actions';
import { UiActions } from 'app/store/actions/ui.actions';
import { UserActions } from 'app/store/actions/user.actions';
import { SearchActions } from 'app/store/actions/search.actions';
import { FileActions } from 'app/store/actions/file.actions';

@Injectable()
export class Actions {

  constructor(
    public configActions: ConfigActions,
    public measureActions: MeasureActions,
    public clinicsActions: ClinicsActions,
    public validationsActions: ValidationsActions,
    public referentialsActions: ReferentialsActions,
    public uiActions: UiActions,
    public userActions: UserActions,
    public searchActions: SearchActions,
    public fileActions: FileActions,
  ) {}
}
