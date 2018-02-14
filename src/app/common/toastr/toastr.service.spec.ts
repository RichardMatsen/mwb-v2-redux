import { ToastrService } from '../../common/mw.common.module';

describe('toastr.service', () => {

  const toastr = new ToastrService();

  it('should display success toastr', () => {
    const sut = () => toastr.success('message');
    expect(sut).not.toThrow();
  });

  it('should display info toastr', () => {
    const sut = () => toastr.info('message');
    expect(sut).not.toThrow();
  });

  it('should display warning toastr', () => {
    const sut = () => toastr.warning('message');
    expect(sut).not.toThrow();
  });

  it('should display error toastr', () => {
    const sut = () => toastr.error('message');
    expect(sut).not.toThrow();
  });

});
