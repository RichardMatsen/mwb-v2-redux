import { SparklineComponent } from './sparkline.component';

describe('sparkline.component', () => {

  let sparkline;
  beforeEach(() => {
    sparkline = new SparklineComponent();
  });

  describe('ngOnInit()', () => {

    it('should call draw() if history has data points', () => {
      const spy = spyOn(sparkline, 'draw');
      sparkline.history = [1, 2, 3];
      sparkline.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });

    it('should not call draw() if history has no data points', () => {
      const spy = spyOn(sparkline, 'draw');
      sparkline.history = [];
      sparkline.ngOnInit();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not call draw() if history is null', () => {
      const spy = spyOn(sparkline, 'draw');
      sparkline.history = null;
      sparkline.ngOnInit();
      expect(spy).not.toHaveBeenCalled();
    });

  });

  describe('draw()', () => {

    describe('points', () => {

      it('should create points string from history', () => {
        sparkline.history = [1, 2, 3];
        sparkline.draw();
        expect(sparkline.points.length).toBeGreaterThan(0);
      });

      it('should create a set of coords for each data point', () => {
        sparkline.history = [1, 2, 3];
        sparkline.draw();
        const coords = sparkline.points.split(' ');
        expect(coords.length).toBe(3);
      });

      it('should create an even spread for x coords', () => {
        sparkline.width = 100;
        sparkline.history = [1, 2, 3];
        sparkline.draw();
        const coords = sparkline.points.split(' ');
        const xcoords = coords.map(xy => +xy.split(',')[0]);
        expect(xcoords).toEqual([0, 50, 100]);
      });

      it('should normalize the data between 0 and 1', () => {
        const norm = sparkline.normalizeData([1, 2, 3]);
        expect(norm).toEqual([0, 0.5, 1]);
      });

      it('should create y coords', () => {
        sparkline.height = 30;
        sparkline.margin = 0;
        sparkline.history = [1, 2, 3];
        sparkline.draw();
        const coords = sparkline.points.split(' ');
        const ycoords = coords.map(xy => +xy.split(',')[1]);
        expect(ycoords).toEqual([0, 15, 30]);
      });

      it('should scale y coords for margin', () => {
        sparkline.height = 30;
        sparkline.margin = 3;
        sparkline.history = [1, 2, 3];
        sparkline.draw();
        const coords = sparkline.points.split(' ');
        const ycoords = coords.map(xy => +xy.split(',')[1]);
        expect(ycoords).toEqual([3, 15, 27]);
      });

    });

  });

});
