import { Component, Input, ElementRef, OnChanges } from '@angular/core';
import { IFileInfo } from '../../model/fileInfo.model';

@Component({
  selector: 'result-wrapper',
  template: `<div></div>`
})
export class ResultWrapperComponent implements OnChanges {

  @Input() fileInfo: IFileInfo;
  @Input() lastRefresh: string;
  @Input() zoom = '100%';

  constructor(
    private elementRef: ElementRef,
  ) {}

  ngOnChanges() {
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
  }
}
