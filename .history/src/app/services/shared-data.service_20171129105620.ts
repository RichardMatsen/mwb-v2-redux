import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SharedDataService{

  // for illustration of service with shared data
  // used in ReferentialsDiagramComponent

  buttonPrompt$ = new BehaviorSubject('Relationship Diagram');
  
  public changePrompt(changeTo: string){
    this.buttonPrompt$.next(changeTo);
  }

}