import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { StoreService, select } from 'app/store/store.service';
import { IFileInfo } from 'app/model/fileInfo.model';
import { IAppState } from 'app/store/state/AppState';
import { IMeasureUpdate } from 'app/model/measure.model';
import { DataService } from 'app/services/data-service/data.service';
import { NameParsingService } from 'app/services/data-service/name-parsing.service';
import { ListFormatterService } from 'app/services/list-formatter.service/list-formatter.service';
import { FileService } from 'app/services/file-service/file.service';
import { ClinicsFormatService } from './clinics-format.service';
import { Logger } from 'app/common/mw.common.module';

@Injectable()
export class ClinicsDataService extends DataService {

  @select(['pages', 'clinics', 'files']) files$: Observable<IFileInfo[]>;
  @select(['pages', 'clinics', 'fileInfo']) fileInfo$: Observable<IFileInfo>;
  @select(['config', 'clinicsConfig']) config$: Observable<any>;

  protected PAGE = 'clinics';
  protected baseUrl = '/data/';
  protected filePrefixes = null;
  private filesToInit = null;
  private filesToDisplay = null;

  constructor (
    protected formatService: ClinicsFormatService,
    protected nameParsingService: NameParsingService,
    protected listFormatterService: ListFormatterService,
    protected fileService: FileService,
    protected logger: Logger,
    protected store: StoreService
  ) {
    super(formatService, nameParsingService, listFormatterService, fileService, logger, store.actions.clinicsActions);
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
      id: 'clinics',
      metric: files[0].metric,
      color: files[0].badgeColor,
      history: this.calcHistory(files)
    };
  }

  protected calcHistory(files): number[] {
    const data = files
      .filter(f => !!f.metric)
      .map(f => (+f.metric.replace('%', '')).toFixed(4));
    const min = Math.min(...data);
    const history = data
      .map(d => +(d - min + 1).toFixed(4))
      .reverse();
    return history;
  }
}
