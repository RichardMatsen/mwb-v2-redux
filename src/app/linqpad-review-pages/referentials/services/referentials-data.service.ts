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
import { ReferentialsFormatService } from './referentials-format.service';
import { Logger } from 'app/common/mw.common.module';

@Injectable()
export class ReferentialsDataService extends DataService {

  @select(['pages', 'referentials', 'files']) files$: Observable<IFileInfo[]>;
  @select(['config', 'referentialsConfig']) config$: Observable<any>;

  protected PAGE = 'referentials';
  private daysToInitialize;
  private daysToDisplay;

  constructor (
    protected formatService: ReferentialsFormatService,
    protected nameParsingService: NameParsingService,
    protected listFormatterService: ListFormatterService,
    protected fileService: FileService,
    protected logger: Logger,
    protected store: StoreService
  ) {
    super(formatService, nameParsingService, listFormatterService, fileService, logger, store.actions.referentialsActions);
  }

  public initializeList() {
    this.getConfig$().subscribe(_ =>
      this.getBaseDataUrl$().subscribe(__ => {
        this.fileService.getFileList(this.baseUrl);
        this.parsed$(this.filesOfType$).subscribe(files => {
          const filesToDisplay = this.getCountFilesForLastNDays(this.daysToDisplay, files);
          const filesToInit = this.getCountFilesForLastNDays(this.daysToInitialize, files);
          super.initializeFileList(filesToInit, filesToDisplay);
        });
      })
    );
  }

  private getConfig$(): Observable<any> {
    return this.config$
      .waitFor$()
      .do(config => {
        this.filePrefixes = config.filePrefixes;
        this.daysToInitialize = config.daysToInitialize;
        this.daysToDisplay = config.daysToDisplay;
      });
  }

  private getCountFilesForLastNDays(numDays: number, files): number {
    return this.filesByDate(files)
      .slice(0, numDays)
      .map(group => group.files.length)
      .reduce((total, num) => total += num, 0 );
  }

  protected getLatestMeasureFromFiles(files: IFileInfo[]): IMeasureUpdate {
    const history = this.calcHistory(files);
    return {
      id: 'referentials',
      metric: history[0],
      color: this.formatService.getBadgeColor(history[0]),
      history: history.reverse()
    };
  }

  protected calcHistory(files: Array<IFileInfo>): number[] {
    return this.filesByDate(files.filter(f => !!f.metric))
      .map(x => x.files.reduce((total, file) => total + file.metric, 0));
  }

}
