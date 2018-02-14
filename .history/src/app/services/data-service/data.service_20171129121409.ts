import '../../rxjs-extensions';

import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { NgRedux, select } from '@angular-redux/store';

import { IAppState } from '../../store/state/AppState';
import { IFileInfo } from '../../model/fileInfo.model';
import { FormatService } from './format.service';
import { NameParsingService } from './name-parsing.service';
import { ListFormatterService } from '../list-formatter.service/list-formatter.service';
import { FileService } from '../file-service/file.service';
import { MigrationWorkBenchCommonModule, ToastrService, Logger, maskedTrim } from '../../common/mw.common.module';
import { IMeasureUpdate } from '../../model/measure.model';
import { PageActions } from '../../linqpad-review-pages/common/page.actions';

@Injectable()
export abstract class DataService {

  @select(['config', 'baseDataUrl']) baseDataUrl$: Observable<string>;
  public abstract config$: Observable<any>;
  public abstract files$: Observable<IFileInfo[]>;

  protected abstract PAGE;
  protected baseUrl;
  protected filePrefixes;

  constructor (
    protected formatService: FormatService,
    protected nameParsingService: NameParsingService,
    protected listFormatterService: ListFormatterService,
    protected fileService: FileService,
    protected logger: Logger,
    protected pageActions: PageActions,
  ) {}

  public abstract getMeasure(): Observable<IMeasureUpdate>;

  protected getBaseUrl$() {
    return this.baseDataUrl$
      .waitFor$()
      .do(baseUrl => {
        this.baseUrl = baseUrl;
      });
  }

  public initializeList(numToInitialize, numToDisplay) {
    this.pageActions.initializeListRequest();
    const source$ = this.getFileListFromFolder()
    const ordered$ = this.listFormatterService.process(source$);
    this.withContent$(ordered$, numToInitialize)
      .subscribe(
        (files) => { this.pageActions.initializeListSuccess(files, numToDisplay); },
        (error) => { this.pageActions.initializeListFailed(error); }
      );
  }

  public updateList(numToDisplay: number) {
    this.pageActions.updateListRequest();

    const source$ = this.files$
      .take(1)                           // ensure it completes - first value is the complete list
      .mergeMap(files => files)          // convert to observable of list items
      
    this.withContent$(source$, numToDisplay)
      .subscribe(
        (files) => { this.pageActions.updateListSuccess(files, numToDisplay); },
        (error) => { this.pageActions.updateListFailed(error); }
      );
  }

  private withContent$(source$: Observable<IFileInfo>, numToInitialize: number): Observable<IFileInfo[]> {
    const withContent$ = source$
      .concatMap((file, index) =>                   // Use concatMap to preserve ordering
        file.content || index >= numToInitialize 
          ? Observable.of(file) 
          : this.getContent(file)
      ) 
      .catch(error => this.handleError(error, 'getContentForList$'));
    return withContent$.toArray();
  }

  private getContent(fileInfo: IFileInfo): Observable<IFileInfo> {
    const url = this.baseUrl + fileInfo.name + '.html';
    return this.fileService.getFile(url)
      .map((res: Response) => {
        const newFileInfo = {...fileInfo};
        const date = res.headers.get('date');
        newFileInfo.lastModified = date ? new Date(date) : null;
        const content = res.text() || '';
        return this.formatService.processContent(content, newFileInfo);
      })
      .catch(error => this.handleError(error, 'getContent'));
  }

  public getFileListFromFolder(): Observable<IFileInfo> {
    return this.fileService.getFileList(this.baseUrl, this.filePrefixes)
      .map(file => this.nameParsingService.parseFile(file, this.filePrefixes))
      .catch(error => this.handleError(error, 'getFileListFromFolder'));
  }

  protected filesByDate(files) {
    const keyFn = (file) => { return this.formatDate(file.effectiveDate); };
    return this.groupBy(files, keyFn)
      .map(group => { return {date: group.key, files: group.group }; });
  }

  private groupBy(arr, keyFn) {
    const grouped = arr.reduce( (grouping, item) => {
      const key = keyFn(item);
      grouping[key] = grouping[key] || [];
      grouping[key].push(item);
      return grouping;
    }, {} );
    return Object.keys(grouped)
      .map(key => { return {key: key, group: grouped[key]}; });
  }

  private formatDate(date) {
    // tslint:disable:prefer-const
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    month = month.length < 2 ? '0' + month : month;
    day = day.length < 2 ? '0' + day : day;
    return [year, month, day].join('-');
  }

  private handleError(error: any, method: string) {
    const caller = `${this.constructor.name}.${method}`;
    this.logger.error(caller + ': ' + error);
    error.caller = caller;
    return Observable.throw(error);
  }
}
