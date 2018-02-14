import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';

import { IFileInfo } from '../../../model/fileInfo.model';
import { IAppState } from '../../../store/state/AppState';
import { IMeasureUpdate } from '../../../model/measure.model';
import { DataService } from '../../../services/data-service/data.service';
import { NameParsingService } from '../../../services/data-service/name-parsing.service';
import { ListFormatterService } from '../../../services/list-formatter.service/list-formatter.service';
import { FileService } from '../../../services/file-service/file.service';
import { ReferentialsFormatService } from './referentials-format.service';
import { ReferentialsActions } from './referentials.actions';
import { Logger } from '../../../common/mw.common.module';
import { waitFor$ } from '../../../store/selector-helpers/selector-helpers';
declare var require
require('../../../store/selector-helpers/selector-helpers');

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
    protected actions: ReferentialsActions,
    private ngRedux: NgRedux<IAppState>,
  ) {
    super(formatService, nameParsingService, listFormatterService, fileService, logger, actions);
  }

  public initializeList() {
    this.getConfig$().subscribe(_ =>
      this.getBaseUrl$().subscribe(__ =>
        this.getFileListFromFolder().toArray().subscribe(files => {
          const filesToDisplay = this.getCountFilesForLastNDays(this.daysToDisplay, files);
          const filesToInit = this.getCountFilesForLastNDays(this.daysToInitialize, files);
          super.initializeList(filesToInit, filesToDisplay);
        })
      )
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
      .reduce((total, num) => { return total += num; }, 0 );
  }

  public getMeasure(): Observable<IMeasureUpdate> {
    return this.files$
      .waitFor$()
      .filter(files => files.filter(file => file.content))
      .map(files => {
        const history = this.calcHistory(files);
        return {
            id: 'referentials',
            metric: history[0],
            color: this.formatService.getBadgeColor(history[0]),
            history: history.reverse()
          };
      });
  }

  private calcHistory(files: Array<IFileInfo>): number[] {
    return this.filesByDate(files.filter(f => !!f.metric))
      .map(x => x.files.reduce((total, file) => total + file.metric, 0));
  }

}
