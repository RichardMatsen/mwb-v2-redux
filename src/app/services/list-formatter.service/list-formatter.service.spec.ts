import { ListFormatterService } from './list-formatter.service';

describe('ListFormatterService', () => {

  const listFormatterService = new ListFormatterService();

  describe('fileInfoComparer', () => {

    const fileInfoComparer = ListFormatterService.fileInfoComparer;

    describe('checking for valid effectiveDates', () => {

      it('should throw error if left object has null effectiveDate', () => {
        const sut = () => { fileInfoComparer( { name: '', effectiveDate: null }, { name: '', effectiveDate: new Date()} ); };
        expect(sut).toThrow();
      });

      it('should throw error if right object has null effectiveDate', () => {
        const sut = () => { fileInfoComparer( { name: '', effectiveDate: new Date() }, { name: '', effectiveDate: null} ); };
        expect(sut).toThrow();
      });

      it('should throw error if both objects have null effectiveDates', () => {
        const sut = () => { fileInfoComparer( { name: '', effectiveDate: null }, { name: '', effectiveDate: null} ); };
        expect(sut).toThrow();
      });

    });

    describe('equal objects', () => {
      it('should return 0 when objects are equal', () => {
        const obj1 = { name: '', effectiveDate: new Date(2016, 6, 1), namePrefix: 'x', effectiveTime: '12:00:00' };
        const obj2 = { name: '', effectiveDate: new Date(2016, 6, 1), namePrefix: 'x', effectiveTime: '12:00:00' };
        const result = fileInfoComparer( obj1, obj2 );
        expect(result).toEqual(0);
      });
    });

    describe('comparing effectiveDates', () => {
      it('should sort effectiveDate highest to lowest', () => {
        const obj1 = { name: '', effectiveDate: new Date(2016, 6, 1), namePrefix: 'x', effectiveTime: '12:00:00' };
        const obj2 = { name: '', effectiveDate: new Date(2016, 6, 2), namePrefix: 'x', effectiveTime: '12:00:00' };

        const result1 = [obj1, obj2].sort(fileInfoComparer);
        expect(result1[0]).toEqual(obj2);

        const result2 = [obj2, obj1].sort(fileInfoComparer);
        expect(result2[0]).toEqual(obj2);
      });
    });

    describe('comparing namePrefixes', () => {
      it('should sort namePrefix lowest to highest', () => {
        const obj1 = { name: '', effectiveDate: new Date(2016, 6, 1), namePrefix: 'x', effectiveTime: '12:00:00' };
        const obj2 = { name: '', effectiveDate: new Date(2016, 6, 1), namePrefix: 'y', effectiveTime: '12:00:00' };

        const result1 = [obj1, obj2].sort(fileInfoComparer);
        expect(result1[0]).toEqual(obj1);

        const result2 = [obj2, obj1].sort(fileInfoComparer);
        expect(result2[0]).toEqual(obj1);
      });
    });

    describe('comparing effectiveTimes', () => {
      it('should sort effectiveTime highest to lowest', () => {
        const obj1 = { name: '', effectiveDate: new Date(2016, 6, 1), namePrefix: 'x', effectiveTime: '12:00:00' };
        const obj2 = { name: '', effectiveDate: new Date(2016, 6, 1), namePrefix: 'x', effectiveTime: '13:00:00' };

        const result1 = [obj1, obj2].sort(fileInfoComparer);
        expect(result1[0]).toEqual(obj2);

        const result2 = [obj2, obj1].sort(fileInfoComparer);
        expect(result2[0]).toEqual(obj2);
      });
    });

  });

  describe('getSequenceNo', () => {
    /*
      Work on Validations and RI Checks proceed on an iterative basis on the same daily cut of data from the live system.
      For this reason, we can group successive runs by filename and date, providing a more intuitive display (see setDisplayName below).
      The grouping is represented by a sequence no, with 0 being the latest version and higher numbers the previous runs.
    */

    const getSequenceNo = listFormatterService.getSequenceNo;
    const hasSameFileNameAndDate = listFormatterService.hasSameFileNameAndDate;

    it('should return 0 when first file is null (beginning of the list)', () => {
      const obj1 = null;
      const obj2 = { name: '', effectiveDate: new Date(2016, 6, 1), effectiveTime: '12:00:00' };
      expect(getSequenceNo(obj1, obj2)).toBe(0);
    });

    it('should return 0 when files have different base name', () => {
      const obj1 = { name: '', baseName: 'file1', effectiveDate: new Date(2016, 6, 1), effectiveTime: '12:00:00', sequenceNo: 0 };
      const obj2 = { name: '', baseName: 'file2', effectiveDate: new Date(2016, 6, 1), effectiveTime: '12:00:00' };
      expect(getSequenceNo(obj1, obj2)).toBe(0);
    });

    it('should return 0 when files have different date', () => {
      const obj1 = { name: 'file1', effectiveDate: new Date(2016, 6, 1), effectiveTime: '12:00:00', sequenceNo: 0 };
      const obj2 = { name: 'file1', effectiveDate: new Date(2016, 6, 2), effectiveTime: '12:00:00' };
      expect(hasSameFileNameAndDate(obj1, obj2)).toBe(false);
      expect(getSequenceNo(obj1, obj2)).toBe(0);
    });

    it('should return sequenceNo +1 when files have same base name and date', () => {
      const obj1 = { name: '', baseName: 'file1', effectiveDate: new Date(2016, 6, 1), effectiveTime: '12:00:00', sequenceNo: 0 };
      const obj2 = { name: '', baseName: 'file1', effectiveDate: new Date(2016, 6, 1), effectiveTime: '13:00:00' };
      expect(hasSameFileNameAndDate(obj1, obj2)).toBe(true);
      expect(getSequenceNo(obj1, obj2)).toBe(1);
    });

  });

  describe('setDisplayName', () => {
    /*
      Feature:
      When there are multiple runs of the same file on the same date, want to display previous runs differently in the FileList.
      The file name and date should be blank on all but the latest run, to imply grouping of successive runs.
      Add displayName to file object. Should default to name, but when sequence no is > 0, use ellipsis as displayName.
      Also, remove effectivTime from displayName as it will be displayed right-adjusted on the row.
    */

    const setDisplayName = listFormatterService.setDisplayName;

    it('should set displayName to name when there is no effectiveTime', () => {
      const file = { name: 'file1 1 Jun 2016 - 12.00', displayName: '',
                     effectiveDate: new Date(2016, 6, 1), effectiveTime: null };
      setDisplayName(file);
      expect(file.displayName).toBe(file.name);
    });

    it('should remove time from displayName when sequenceNo = 0', () => {
      const file = { name: 'file1 1 Jun 2016 - 12.00', displayName: '',
                     effectiveDate: new Date(2016, 6, 1), effectiveTime: '12:00', sequenceNo: 0 };
      setDisplayName(file);
      expect(file.displayName).toEqual('file1 1 Jun 2016');
    });

    it('should not remove time from displayName when effectiveTime does not match file name time', () => {
      const file = { name: 'file1 1 Jun 2016 - 13.00', displayName: '',
                     effectiveDate: new Date(2016, 6, 1), effectiveTime: '12:00', sequenceNo: 0 };
      setDisplayName(file);
      expect(file.displayName).toEqual('file1 1 Jun 2016 - 13.00');
    });

    it('should set displayName to ellipsis when sequenceNo > 0', () => {
      const file = { name: 'file1 1 Jun 2016 - 12.00', displayName: '',
                     effectiveDate: new Date(2016, 6, 1), effectiveTime: '12:00', sequenceNo: 1 };
      setDisplayName(file);
      expect(file.displayName).toEqual('...');
    });

  });

});
