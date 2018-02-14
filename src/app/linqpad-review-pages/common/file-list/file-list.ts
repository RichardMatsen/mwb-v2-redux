import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';

import { IFileInfo } from '../../../model/fileInfo.model';

// REF for scrolling to the bottom of the list:
//      http://plnkr.co/edit/7yz2DUttPjI5GVJkvr5h?open=app%2Fapp.component.ts
//      http://stackoverflow.com/questions/35232731/angular2-scroll-to-bottom-chat-style

@Component({
  selector: 'file-list',
  templateUrl: './file-list.html',
  styleUrls: ['../../../common/thin.scrollbar/thin.scrollbar.css', './file-list.css', ],
})
export class FileListComponent {

  @Input() visibleFiles: IFileInfo[] = [];
  @Input() fileCount: number;
  @Input() numToDisplay = 5;
  @Input() title = 'Select file';

  @Output() fileSelected = new EventEmitter();
  @Output() numDisplayedChanged = new EventEmitter();

  selectFile(file: IFileInfo) {
    this.fileSelected.emit(file);
  }

  setNumDisplayed(numDisplayed: number) {
    this.numToDisplay = numDisplayed;
    this.numDisplayedChanged.emit(numDisplayed);
  }

}
