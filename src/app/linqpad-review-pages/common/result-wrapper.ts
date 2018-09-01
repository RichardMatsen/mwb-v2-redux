import { Component, Input, ElementRef, OnInit, OnChanges, OnDestroy } from '@angular/core';
import * as Mark from 'mark.js';

import { IFileInfo } from 'app/model/fileInfo.model';
import { StoreService, select } from 'app/store/store.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'result-wrapper',
  template: `<div></div>`
})
export class ResultWrapperComponent implements OnInit, OnChanges, OnDestroy {

  @Input() fileInfo: IFileInfo;
  @Input() lastRefresh: string;
  @Input() zoom = '100%';

  @select(['search', 'searchTerm']) searchTerm$;

  private searchTermSubscription;

  constructor(
    private elementRef: ElementRef,
    private store: StoreService
  ) {}

  ngOnInit() {
    this.searchTermSubscription = this.searchTerm$
    .debounceTime(400)
    .switchMap(searchTerm => {
      this.markSearchTerm(searchTerm);
      return Observable.empty();
    })
    .subscribe();
  }

  ngOnDestroy() {
    this.searchTermSubscription.unsubscribe();
  }

  ngOnChanges() {  // Watches @Input fileInfo
    this.setPageContent();
  }

  setPageContent() {
    if (!this.fileInfo) {
      return;
    }
    const outerDiv = this.elementRef.nativeElement.getElementsByTagName('div')[0];
    outerDiv.setAttribute('id', 'dataContainer');
    outerDiv.innerHTML = this.fileInfo.content;
    outerDiv.style.zoom = this.zoom;
    setTimeout(() => {  // mark content in the next tick
      this.searchTerm$.take(1).subscribe(searchTerm => {
        this.markSearchTerm(searchTerm);
      });
    }, 0);
  }

  private markSearchTerm(searchTerm: string) {
    const el = this.elementRef.nativeElement.getElementsByTagName('div')[0];
    const instance = new Mark(el);
    instance.unmark();
    if (searchTerm) {
      instance.mark(searchTerm, {
        className: 'markSearch',
        done: (matchCount) => this.store.actions.searchActions.setSearchCount(matchCount)
      });
    }
  }
}
