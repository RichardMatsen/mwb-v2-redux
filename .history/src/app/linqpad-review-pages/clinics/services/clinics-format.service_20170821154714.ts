import { IFileInfo } from '../../../model/FileInfo';
import { FormatService } from '../../../services/data-service/format.service';

export class ClinicsFormatService extends FormatService {

  getBadgeColor(metric) {
    const num = +metric.replace('%', '');
    return num >= 95 ? 'green'
      : num >= 75 ? 'orange' : 'red';
  }

  getMetric(tempDiv: HTMLElement): string {
    let totalErrors = 0;
    const elementsAffected = tempDiv.getElementsByClassName('columntotal affected');
    for (let i = 0; i < elementsAffected.length; i++) {
      totalErrors += this.getTotalFromElement(elementsAffected[i]);
    }

    const elementsActiveAppoints = tempDiv.getElementsByClassName('n active-appoints');
    const activeAppoints = elementsActiveAppoints.length === 0 ? 0 : this.getTotalFromElement(elementsActiveAppoints[0]);

    const percent = activeAppoints === 0 ? 0 : (activeAppoints - totalErrors) / activeAppoints * 100;
    return `${percent.toFixed(2)}%`;
  }

  private getTotalFromElement(element) {
    let total = 0;
    const totalAsString = element.innerHTML;
    const isnum = /^\d+$/.test(totalAsString);
    if (isnum) {
      total = Number(totalAsString);
    }
    return total;
  }
}
