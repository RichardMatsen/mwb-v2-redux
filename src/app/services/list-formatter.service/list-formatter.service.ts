import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IFileInfo } from 'app/model/fileInfo.model';

@Injectable()
export class ListFormatterService {

  public process(files$: Observable<IFileInfo[]>): Observable<IFileInfo[]> {
    return files$
      .map(files => files.sort(this.fileInfoComparer))
      .map(files => this.applySequence(files));
  }

  fileInfoComparer(a: IFileInfo, b: IFileInfo): number {
    if (!a.effectiveDate || !b.effectiveDate) {
      throw new Error('Effective dates not valid. a: ' + a + ', b: ' + b);
    }
    return a.effectiveDate > b.effectiveDate ? -1 :             // Latest date on top
            a.effectiveDate < b.effectiveDate ? 1 :
              a.namePrefix < b.namePrefix ? -1 :                // then sort by name prefix to keep similar files together
                a.namePrefix > b.namePrefix ? 1 :
                  a.effectiveTime > b.effectiveTime ? -1 :      // then the latest time (version)
                    a.effectiveTime < b.effectiveTime ? 1 : 0;
  }

  applySequence = (files: IFileInfo[]): IFileInfo[] => {
    return files.reduce((acc, current) => {
      const previous = acc[acc.length - 1];
      const sequenced = this.sequencer(previous, current);
      return [...acc, sequenced];
    }, []);
  }

  sequencer = (previous: IFileInfo, current: IFileInfo): IFileInfo => {
    current.sequenceNo = this.getSequenceNo(previous, current);
    this.setDisplayName(current);
    return current;
  }

  getSequenceNo = (previous: IFileInfo, current: IFileInfo): number => {
    if (!previous || !current || !current.effectiveTime) {
      return 0;
    }
    if (!this.hasSameFileNameAndDate(previous, current)) {
      return 0;
    }
    return previous.sequenceNo + 1;
  }

  hasSameFileNameAndDate(previous: IFileInfo, current: IFileInfo): boolean {
    return previous.baseName === current.baseName &&
      previous.effectiveDate.getTime() === current.effectiveDate.getTime();
  }

  setDisplayName = (fileInfo: IFileInfo) => {
    fileInfo.displayName = fileInfo.name;

    if (!fileInfo.effectiveTime || fileInfo.sequenceNo === undefined || fileInfo.sequenceNo < 0) {
      return;
    }

    if (fileInfo.sequenceNo === 0) {
      this.removeTimeFromDisplayName(fileInfo);
    } else {
      fileInfo.displayName = '...';
    }
  }

  removeTimeFromDisplayName = (fileInfo) => {
    const timeAsInFileName = fileInfo.effectiveTime.replace(':', '.');
    const timePos = fileInfo.name.indexOf(timeAsInFileName);
    if (timePos !== -1) {
      fileInfo.displayName = fileInfo.name.replace(` - ${timeAsInFileName}`, '').trimWithMask( '- ' );
    }
  }

}
