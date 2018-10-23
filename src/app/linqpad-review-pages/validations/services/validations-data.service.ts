import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { StoreService, select } from 'app/store/store.service';
import { IFileInfo } from 'app/model/fileInfo.model';
import { IMeasureUpdate } from 'app/model/measure.model';
import { DataService } from 'app/services/data-service/data.service';
import { NameParsingService } from 'app/services/data-service/name-parsing.service';
import { ListFormatterService } from 'app/services/list-formatter.service/list-formatter.service';
import { FileService } from 'app/services/file-service/file.service';
import { ValidationsFormatService } from './validations-format.service';
import { Logger } from 'app/common/mw.common.module';

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
    protected store: StoreService
  ) {
    super(formatService, nameParsingService, listFormatterService, fileService, logger, store.actions.validationsActions);
  }

  public initializeList() {
    this.getConfig$().subscribe(_ =>
      this.getBaseDataUrl$().subscribe(__ =>
        super.initializeFileList(this.filesToInit, this.filesToDisplay)
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

  protected getLatestMeasureFromFiles(files: IFileInfo[]): IMeasureUpdate {
    return {
      id: 'validations',
      metric: files[0].metric,
      color: files[0].badgeColor,
      history: this.calcHistory(files)
    };
  }

  protected calcHistory(files): number[] {
    return (files || [])
      .filter(f => !!f.metric)
      .map(f => f.metric)
      .reverse();
  }
}
