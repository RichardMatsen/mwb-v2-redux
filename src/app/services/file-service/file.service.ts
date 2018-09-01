import 'app/rxjs-extensions';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { StoreService, select } from 'app/store/store.service';
import { IAppState } from 'app/store/state/AppState';
import { Logger } from 'app/common/mw.common.module';
import { UiActions } from 'app/store/actions/ui.actions';

@Injectable()
export class FileService {

  @select(['file', 'fileList']) storeFileList$;

  constructor (
    public http: Http,
    public router: Router,
    public logger: Logger,
    public store: StoreService
  ) {}

  public getFileList(baseUrl: string): void {
    this.storeFileList$.subscribe(fileList => {
      if (fileList.files || fileList.pending) {
        return;
      }
      const url = `${baseUrl}filelist.txt`;
      this.store.actions.fileActions.setFileListPending(true);
      this.http.get(url)
        .map((res: Response) => res.text().replace(/\r/, '').split(/\n/))
        .map(files => files.filter(file => file))  // remove blank lines
        .catch(error => this.handleFileListError(error))
        .subscribe(files => this.store.actions.fileActions.setFileListSuccess(files));
    });
  }

  public getFile(url: string): Observable<Response> {
    return this.http.get(url)
      .catch((error: HttpErrorResponse) => this.handleError(error, 'getFile'));
  }

  private handleFileListError(error: Response | any) {
    this.store.actions.fileActions.setFileListFailed(error);

    const caller = `${this.constructor.name}.getFileList`;
    const msg = `Caller: ${caller}, ${error}. Error status: ${error.status} }`;
    error.caller = caller;
    if (error.status === 404) {
      this.store.actions.uiActions.setFour0FourMessage(caller, msg, error.url);
      this.router.navigate(['/404'] );
    }
    return Observable.throw(error);
  }

  private handleError(error: Response | any, method: string) {
    if (method === 'getFileList') {
      this.store.actions.fileActions.setFileListFailed(error);
    }
    const caller = `${this.constructor.name}.${method}`;
    const msg = `Caller: ${caller}, ${error}. Error status: ${error.status} }`;
    error.caller = caller;
    if (error instanceof Response && error.status === 404) {
      // this.store.dispatch( {
      //   type: UiActions.FOUR0FOUR_MESSAGE,
      //   four0four: { caller: caller,  url: error.url }
      // });
      this.store.actions.uiActions.setFour0FourMessage( caller, msg, error.url);
      this.router.navigate(['/404'] );
    }
    return Observable.throw(error);
  }
}
