import { IFileInfo } from '../../../model/fileInfo.model';
import { FormatService } from '../../../services/data-service/format.service';

export class ReferentialsFormatService extends FormatService {

  getBadgeColor(metric) {
    return metric === 0 ? 'green'
      : metric < 10 ? 'orange' : 'red';
  }

  getMetric(tempDiv: HTMLElement): number {
    let total = 0;
    const elementsWithColumnTotal = tempDiv.getElementsByClassName('columntotal');
    const totalAsString = elementsWithColumnTotal[3].innerHTML;
    const isnum = /^\d+$/.test(totalAsString);
    if (isnum) {
      total = Number(totalAsString);
    }
    return total;
  }
}
