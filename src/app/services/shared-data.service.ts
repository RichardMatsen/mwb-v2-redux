import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SharedDataService {

  // for illustration of service with shared data
  // used in ReferentialsDiagramComponent

  subject = new BehaviorSubject<string>('');
  buttonPrompt$ = this.subject.asObservable();

  public changePrompt(changeTo: string) {
    this.subject.next(changeTo);
  }
}
