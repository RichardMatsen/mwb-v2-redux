import { IFileInfo } from 'app/model/fileInfo.model';

export abstract class FormatService {

  public processContent(content: string, fileInfo: IFileInfo ): IFileInfo {
    const id = 'dataContainer';
    const searchFor = /Command[\s]+Timeout[\s]+only[\s]+supported[\s]+by[\s]+SQL[\s]+Client[\s]+\(so[\s]+far\)<br\/>/;
    const regex = new RegExp(searchFor, 'g');
    const data = content.replace(regex, '');

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = data;
    this.prefixStylesWithId(tempDiv, id);
    fileInfo.content = tempDiv.innerHTML;
    fileInfo.metric = this.getMetric(tempDiv);
    fileInfo.badgeColor = this.getBadgeColor(fileInfo.metric);
    return fileInfo;
  }

  public abstract getMetric(tempDiv: HTMLElement): number | string ;

  public abstract getBadgeColor(errorCount): string;

  private prefixStylesWithId(tempDiv: HTMLElement, id: string) {
    const styleSections = tempDiv.getElementsByTagName('style');
    for (let i = 0; i < styleSections.length; ++i) {
      const styles = styleSections[i];
      const styleLines = styles.innerHTML.split(/\r?\n/);
      const newStyles = new Array<String>();
      styleLines.forEach((line: string) => {
        if (line.indexOf('{') !== -1) {
          line = '#' + id + ' ' + line;
          line = this.replaceAll(line, ',', ', #' + id);
        }
        newStyles.push(line);
      });
      styles.innerHTML = newStyles.join('\n');
    }
  }

  private replaceAll(theString: string, search: string, replace: string ): string {
    return theString.replace(new RegExp(this.escapeRegExp(search), 'g'), replace);
  }

  private escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\$&'); // $& means the whole matched string
  }
}
