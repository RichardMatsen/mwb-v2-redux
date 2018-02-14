import '../../rxjs-extensions';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';

import { IAppState } from '../../store/state/AppState';
import { Logger } from '../../common/mw.common.module';
import { UiActions } from '../../common/ui-actions/ui-actions';

@Injectable()
export class FileService {

  constructor (
    public http: Http,
    public router: Router,
    public ngRedux: NgRedux<IAppState>,
    public logger: Logger
  ) {}

  public getFileList(baseUrl: string, filePrefixes: string[]): Observable<string> {
    if (!Array.isArray(filePrefixes) && typeof filePrefixes === 'string') {
      filePrefixes = [filePrefixes];
    }
    const url = `data/filelist.txt`;
    return this.http.get(url)
      .mergeMap((res: Response) => {
        const files = res.text().replace(/\r/, '').split(/\n/);
        return files
          .filter((file: string) => (filePrefixes.some((value, index, array) => file.startsWith(value) )));
      })
      .catch(error => this.handleError(error, 'getFileList'));
  }

  public getFile(url: string): Observable<Response> {
    return this.http.get(url)
      .catch(error => this.handleError(error, 'getFile'));
  }

  private handleError(error: Response | any, method: string) {
    const caller = `${this.constructor.name}.${method}`;
    const msg = `Caller: ${caller}, ${error}. Error status: ${error.status} }`;
    error.caller = caller;
    if (error instanceof Response && error.status === 404) {
      this.ngRedux.dispatch( {
        type: UiActions.FOUR0FOUR_MESSAGE,
        four0four: { caller: caller,  url: error.url }
      });
      this.router.navigate(['/404'] );
    }
    return Observable.throw(error);
  }
}
