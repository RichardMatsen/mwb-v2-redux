/* tslint:disable:no-unused-variable */
import { TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { NameParsingService } from './name-parsing.service';
// import { MigrationWorkBenchCommonModule, maskedTrim } from '../../common/mw.common.module';
require('../../masked-trim/masked-trim');

describe('NameParsingService', () => {

  let nameParsingService: NameParsingService;
  const filePrefixes: string[] = ['Volatile Validations'];

  beforeEach(() => {
    nameParsingService = new NameParsingService();
  });

  describe('parseFile', () => {

    it('should parse a file name', () => {
      const result = nameParsingService.parseFile('file1 01 Jun 2016', filePrefixes);
      expect(result.name).toEqual('file1 01 Jun 2016');
    });

    it('should extract effectiveDate from file name', () => {
      const result = nameParsingService.parseFile('file1 01 Jun 2016', filePrefixes);
      expect(result.effectiveDate).toEqual(new Date(2016, 5, 1));
    });

    it('should set effectiveDate to null if 3 digit month not in file name', () => {
      const result = nameParsingService.parseFile('file1 01 ZZZ 2016', filePrefixes);
      expect(result.effectiveDate).toBe(null);
    });

    it('should remove html extension from file name', () => {
      const result = nameParsingService.parseFile('file1 01 Jun 2016.html', filePrefixes);
      expect(result.name).toEqual('file1 01 Jun 2016');
    });

  });

  describe('parseFiles', () => {

    it('should parse a list of file names', () => {
      const files = ['file1 01 Jun 2016.html', 'file2 02 Jun 2016.html', 'file3 03 Jun 2016.html'];
      const result = nameParsingService.parseFiles(files, filePrefixes);

      expect(result.length).toEqual(3);
      expect(result[0].name).toEqual('file1 01 Jun 2016');
      expect(result[1].name).toEqual('file2 02 Jun 2016');
      expect(result[2].name).toEqual('file3 03 Jun 2016');
    });

    it('should handle an empty list', () => {
      const result = nameParsingService.parseFiles([], filePrefixes);
      expect(result.length).toEqual(0);
    });
  });
});
