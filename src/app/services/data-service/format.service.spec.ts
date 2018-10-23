/* tslint:disable:no-unused-variable */
import { IFileInfo } from 'app/model/fileinfo.model';
import { FormatService } from './format.service';

class TestFormatService extends FormatService {
  getMetric() { return '999'; }
  getBadgeColor() { return 'black'; }
}

describe('FormatService', () => {

  let formatService: FormatService, sampleContent: string;

  beforeEach(() => {
    formatService = new TestFormatService();
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
  });

  it('should create the service', () => {
    expect(formatService).toBeTruthy();
  });

  describe('processContent method', () => {

    let fileInfo: IFileInfo;

    beforeEach(() => {
      fileInfo = <IFileInfo>{
        name: 'file1',
        content: '',
        effectiveDate: new Date(2016, 6, 1),
        metric: 0,
        badgeColor: 'grey'
      };
    });

    it('should set the content', () => {
      formatService.processContent('some content', fileInfo);
      expect(fileInfo.content).toEqual('some content');
    });

    it('should set the error count (returned from dervived class)', () => {
      formatService.processContent(sampleContent, fileInfo);
      expect(fileInfo.metric).toEqual('999');
    });

    it('should set the badge color', () => {
      formatService.processContent(sampleContent, fileInfo);
      expect(fileInfo.badgeColor).toEqual('black');
    });

    it('should remove "Command Timeout" text', () => {
      formatService.processContent(sampleContent, fileInfo);
      expect(fileInfo.content.indexOf('Command TImeout')).toEqual(-1);
    });

    it('should prefix style with an id', () => {
      const id = '#dataContainer';
      expect(sampleContent).not.toContain(id);
      const result = formatService.processContent(sampleContent, fileInfo);
      expect(result.content).toContain(id);
    });
  });
});
