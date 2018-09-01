/* tslint:disable:no-unused-variable */

import { async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { IFileInfo } from 'app/model/fileinfo.model';
import { ClinicsFormatService } from './clinics-format.service';

describe('ClinicsFormatService', () => {

  let formatService: ClinicsFormatService, sampleContent: string;

  beforeEach(async(() => {
    formatService = new ClinicsFormatService();
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
            <td title="Totals" class="columntotal"></td>
            <td title="Totals" class="columntotal"></td>
            <td title="Total=1190453&#xD;&#xA;Average=297613.25" class="columntotal affected">319</td>
          </tr>
          <tr>
            <td>Active</td>
            <td class="n active-appoints">24668</td>
            <td>
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
      { metric: '100%', color: 'green' },
      { metric: '95%', color: 'green' },
      { metric: '94%', color: 'orange' },
      { metric: '75%', color: 'orange' },
      { metric: '74%', color: 'red' },
      { metric: '9%', color: 'red' },
    ];

    matrix.forEach(pair => {
      it(`should return ${pair.color} if metric = ${pair.metric}`, () => {
        expect(formatService.getBadgeColor(pair.metric)).toEqual(pair.color);
      });
    });
  });

  describe('getMetric()', () => {
    it('should get metric data from html, using "columntotal affected" class and extracting number from text content', () => {
      const dom = document.createElement('html');
      dom.innerHTML = sampleContent;
      const metric = formatService.getMetric(dom);
      expect(metric).toEqual('98.71%');
    });
  });

});
