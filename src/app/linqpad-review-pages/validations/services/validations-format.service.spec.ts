/* tslint:disable:no-unused-variable */

import { async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { IFileInfo } from 'app/model/fileinfo.model';
import { ValidationsFormatService } from './validations-format.service';

describe('ValidationFormatService', () => {

  let formatService: ValidationsFormatService, sampleContent: string;

  beforeEach(async(() => {
    formatService = new ValidationsFormatService();
    sampleContent = `
      <head>
        <style>
            code.xml em {
                color: red;
                font-weight: normal;
                font-style: normal
            }
        </style>
      </head>
      <body>Command Timeout only supported by SQL Client (so far)<br/><br/>
        <span style="color: green; font-weight:bold; font-size: 110%;">
          <th class="headingpresenter">Header goes here</th>
        </span>
        <td class="headingpresenter">
        <table id="t1">
          <tr>
            <td class="typeheader" colspan="7">(222 items)</td>
          </tr>
        </table>
      <body>
    `;
  }));

  it('should create the service', async(() => {
    expect(formatService).toBeTruthy();
  }));

  describe('getBadgeColor()', () => {

    const matrix = [
      { metric: 0, color: 'green' },
      { metric: 1, color: 'orange' },
      { metric: 9, color: 'orange' },
      { metric: 10, color: 'red' },
    ];

    matrix.forEach(pair => {
      it(`should return ${pair.color} if metric = ${pair.metric}`, () => {
        expect(formatService.getBadgeColor(pair.metric)).toEqual(pair.color);
      });
    });
  });

  describe('getMetric()', () => {
    it('should get metric data from html, using "typeheader" class and extracting number from text content', () => {
      const dom = document.createElement('html');
      dom.innerHTML = sampleContent;
      const metric = formatService.getMetric(dom);
      expect(metric).toEqual(222);
    });
  });

});
