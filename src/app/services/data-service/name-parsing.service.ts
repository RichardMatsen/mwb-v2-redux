import { IFileInfo } from 'app/model/fileInfo.model';

export class NameParsingService {

  parseFiles(files: string[], prefixes: string[]): IFileInfo[] {
    return files.map(file => {
      return this.parseFile(file, prefixes);
    });
  }

  parseFile(fileName: string, prefixes: string[]): IFileInfo {
    const fileInfo = {
      name: fileName.replace('.html', ''),
      namePrefix: '',
      baseName: this.getBaseName(fileName),
      displayName: '',
      effectiveDate: this.parseEffectiveDate(fileName),
      effectiveTime: this.parseEffectiveTime(fileName)
    };
    fileInfo.namePrefix = prefixes.find(pref => fileInfo.name.startsWith(pref));
    fileInfo.displayName = fileInfo.name;
    return fileInfo;
  }

  private getBaseName(fileName) {
    const month = this.findMonth(fileName);
    if (!month.found) {
      return fileName;
    }
    const base = fileName.substr(0, month.pos - 4).trimWithMask( '( ' );
    return base;
  }

  private parseEffectiveDate(fileName: string): Date {
    const month = this.findMonth(fileName);
    if (month.found) {
      const day = parseInt(fileName.substr(month.pos - 3, 2), 0);
      const year = parseInt(fileName.substr(month.pos + 4, 4), 0);
      return new Date(year, month.number, day);
    }
    return null;
  }

  private parseEffectiveTime(fileName: string): string {
    const time = fileName.match(/\d\d\.\d\d/);
    if (!time) {
      return '';
    }
    return time[0].replace('.', ':');
  }

  private findMonth(fileName: string) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const words = fileName.split(' ');

    const month = {pos: -1, number: -1, found: false};
    let monthIndex = -1;
    for (const word of words) {
      monthIndex = months.indexOf(word);
      if ( monthIndex > -1 ) {
        month.number = monthIndex;
        month.pos = fileName.indexOf(months[monthIndex]);
        month.found = true;
        break;
      }
    }
    return month;
  }
}
