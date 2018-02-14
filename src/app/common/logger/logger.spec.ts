import { Logger } from './logger';

describe('Logger', () => {

  const logger = new Logger('MWB', '');

  beforeEach(function(){
    spyOn(console, 'log');
  });

  it('should log a message', () => {
    logger.log('a message');
    expect(console.log).toHaveBeenCalled();
  });

  it('should error a message', () => {
    logger.error('a message');
    expect(console.log).toHaveBeenCalled();
  });

});
