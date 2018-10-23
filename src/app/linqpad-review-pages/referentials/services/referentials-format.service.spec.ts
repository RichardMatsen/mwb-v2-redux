/* tslint:disable:no-unused-variable */
import { async } from '@angular/core/testing';

import { ReferentialsFormatService } from './referentials-format.service';

describe('ReferentialsFormatService', () => {

  let formatService: ReferentialsFormatService, sampleContent: string;

  beforeEach(async(() => {
    formatService = new ReferentialsFormatService();
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
            <td title="Total=3442295&#xD;&#xA;Average=229486.3333" class="columntotal">3442295</td>
            <td title="Total=3227589&#xD;&#xA;Average=215172.6" class="columntotal">3227589</td>
            <td title="Total=31260&#xD;&#xA;Average=2084" class="columntotal">30260</td>
            <td title="Totals" class="columntotal"></td>
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
    it('should get metric data from html, using third "columntotal" class and extracting number from text content', () => {
      const dom = document.createElement('html');
      dom.innerHTML = sampleContent;
      const metric = formatService.getMetric(dom);
      expect(metric).toEqual(30260);
    });
  });

});
