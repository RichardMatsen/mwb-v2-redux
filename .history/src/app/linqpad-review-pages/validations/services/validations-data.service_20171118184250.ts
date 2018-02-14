import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';

import { IFileInfo } from '../../../model/FileInfo';
import { IAppState } from '../../../store/state/AppState';
import { IMeasureUpdate } from '../../../model/measure.model';
import { DataService } from '../../../services/data-service/data.service';
import { NameParsingService } from '../../../services/data-service/name-parsing.service';
import { ListFormatterService } from '../../../services/list-formatter.service/list-formatter.service';
import { FileService } from '../../../services/file-service/file.service';
import { ValidationsFormatService } from './validations-format.service';
import { ValidationsActions } from './validations.actions';
import { Logger } from '../../../common/mw.common.module';
import { waitFor$ } from '../../../store/selector-helpers/selector-helpers';
declare var require
require('../../../store/selector-helpers/selector-helpers');

@Injectable()
export class ValidationsDataService extends DataService {

  @select(['pages', 'validations', 'files']) files$: Observable<IFileInfo[]>;
  @select(['pages', 'validations', 'fileInfo']) fileInfo$: Observable<IFileInfo>;
  @select(['config', 'validationsConfig']) config$: Observable<any>;

  protected PAGE = 'validations';
  protected baseUrl;
  protected filePrefixes;
  private filesToInit;
  private filesToDisplay;

  constructor (
    protected formatService: ValidationsFormatService,
    protected nameParsingService: NameParsingService,
    protected listFormatterService: ListFormatterService,
    protected fileService: FileService,
    protected logger: Logger,
    protected actions: ValidationsActions,
    private ngRedux: NgRedux<IAppState>,
  ) {
    super(formatService, nameParsingService, listFormatterService, fileService, logger, actions);
  }

  public initializeList() {
    this.getConfig$().subscribe(_ =>
      this.getBaseUrl$().subscribe(__ =>
        super.initializeList(this.filesToInit, this.filesToDisplay)
      )
    );
  }

  private getConfig$(): Observable<any> {
    return this.config$
      .waitFor$()
      .do(config => {
        this.filePrefixes = config.filePrefixes;
        this.filesToInit = config.numDataPointsForSparkline;
        this.filesToDisplay = config.numInitialFilesToDisplay;
      });
  }

  public getMeasure(): Observable<IMeasureUpdate> {
    return this.files$
      .waitFor$()
      .map(files => {
        return { id: 'validations', metric: files[0].metric, color: files[0].badgeColor, history: this.calcHistory(files) };
      });
  }

  private calcHistory(files): number[] {
    return files
      .filter(f => !!f.metric)
      .map(f => f.metric)
      .reverse();
  }
}
