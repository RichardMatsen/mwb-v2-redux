import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ampm'
})
export class AmpmPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const timeMatch = value.match(/(([0-9]|1[0-9]|2[0-3]):([0-5][0-9]))/);
    if ( (typeof value !== 'string' && !(value instanceof String)) || ! timeMatch ) {
      return '';
    }

    const [hoursString, minsString] = value.split(':');
    const hours = Number.parseInt(hoursString);
    const mins = Number.parseInt(minsString);
    const amORpm = hours >= 12 ? 'pm' : 'am';
    return `${hours > 12 ? hours - 12 : hours}:${minsString} ${amORpm}`;
  }

}
