import 'app/rxjs-extensions';

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';

import { select } from 'app/store/store.service';
import { IFileInfo } from 'app/model/fileInfo.model';
import { FormatService } from './format.service';
import { NameParsingService } from './name-parsing.service';
import { ListFormatterService } from '../list-formatter.service/list-formatter.service';
import { FileService } from '../file-service/file.service';
import { Logger } from 'app/common/mw.common.module';
import { IMeasureUpdate } from 'app/model/measure.model';
import { PageActions } from 'app/store/actions/page.actions';

@Injectable()
export abstract class DataService {

  @select(['config', 'baseDataUrl']) baseDataUrl$: Observable<string>;
  @select(['file', 'fileList', 'files']) fileNames$: Observable<string[]>;
  public abstract config$: Observable<any>;
  public abstract files$: Observable<IFileInfo[]>;

  protected abstract PAGE: string;
  protected baseUrl: string;
  protected filePrefixes: string[];

  constructor (
    protected formatService: FormatService,
    protected nameParsingService: NameParsingService,
    protected listFormatterService: ListFormatterService,
    protected fileService: FileService,
    protected logger: Logger,
    protected pageActions: PageActions,
  ) {}

  protected abstract getLatestMeasureFromFiles(files: IFileInfo[]): IMeasureUpdate;
  protected abstract calcHistory(files: IFileInfo[]): number[];

  public getMeasure(): Observable<IMeasureUpdate> {
    return this.files$
      .waitFor$(data => data.length)
      .map(files => files.filter(file => file.content))  // exclude any file not yet read or not found on disk
      .map(this.getLatestMeasureFromFiles.bind(this));   // use bind to change method's context
  }

  protected getBaseDataUrl$() {
    return this.baseDataUrl$
      .waitFor$()
      .do(baseUrl => {
        this.baseUrl = baseUrl;
      });
  }

  public initializeFileList(numToInitialize, numToDisplay) {
    this.pageActions.initializeListRequest();
    this.fileService.getFileList(this.baseUrl);
    const parsed$ = this.parsed$(this.filesOfType$);
    const ordered$ = this.listFormatterService.process(parsed$);
    const withContent$ = this.withContent$(ordered$, numToInitialize);
    withContent$.subscribe(
      (files) => { this.pageActions.initializeListSuccess(files, numToDisplay); },
      (error) => { this.pageActions.initializeListFailed(error); }
    );
  }

  get filesOfType$(): Observable<string[]> {
    return this.fileNames$
      .waitFor$()  // ensures can move between Observable<fileInfo> and Observable<fileIno[]> with .toArray()
      .map(files => files.filter(file =>
        this.filePrefixes.some(value => file.startsWith(value))
      ));
  }

  protected parsed$(files$: Observable<string[]>): Observable<IFileInfo[]> {
    return files$.map(files =>
      this.nameParsingService.parseFiles(files, this.filePrefixes)
    );
  }

  public updateList(numToDisplay: number) {
    this.pageActions.updateListRequest();
    const files$ = this.files$.take(1);  // read once - otherwise, endlessly loops due to self update
    this.withContent$(files$, numToDisplay)
      .subscribe(
        (files) => { this.pageActions.updateListSuccess(files, numToDisplay); },
        (error) => { this.pageActions.updateListFailed(error); }
      );
  }

  private withContent$(files$: Observable<IFileInfo[]>, numToInitialize: number): Observable<IFileInfo[]> {
    return files$.concatMap(files => {
      const withContent$ = files.map((file, index) => {
        return file.content || index >= numToInitialize
          ? Observable.of(file)
          : this.getContent(file);
      });
      return forkJoin(...withContent$);
    })
    .catch(error => this.handleError(error, 'withContent$'));
  }

  public getContent(fileInfo: IFileInfo): Observable<IFileInfo> {
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

  protected filesByDate(files) {
    const keyFn = (file) => this.formatDate(file.effectiveDate);
    return this.groupBy(files, keyFn)
      .map(group => ({date: group.key, files: group.group }));
  }

  private groupBy(arr, keyFn) {
    const grouped = arr.reduce( (grouping, item) => {
      const key = keyFn(item);
      grouping[key] = grouping[key] || [];
      grouping[key].push(item);
      return grouping;
    }, {} );
    return Object.keys(grouped)
      .map(key => ({key: key, group: grouped[key]}));
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
