import { IFileInfo } from '../../../model/fileInfo.model';
import { FormatService } from '../../../services/data-service/format.service';

export class ValidationsFormatService extends FormatService {

  getBadgeColor(metric: number) {
    return metric === 0 ? 'green'
      : metric < 10 ? 'orange' : 'red';
  }

  getMetric(tempDiv: HTMLElement): number {
    let total = 0;
    const elementsWithCount = tempDiv.getElementsByClassName('typeheader');
    for (let i = 0; i < elementsWithCount.length; ++i) {
      const countAsString = elementsWithCount[i].innerHTML.substr(1).split(' ')[0];
      const isnum = /^\d+$/.test(countAsString);
      if (isnum) {
        total += Number(countAsString);
      }
    }
    return total;
  }
}
