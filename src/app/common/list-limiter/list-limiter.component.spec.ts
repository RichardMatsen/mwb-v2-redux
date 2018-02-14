import { ListLimiterComponent } from './list-limiter.component';

describe('list-limiter.component', () => {

  it('should increment numdisplayed', () => {
    const listLimiter = new ListLimiterComponent();
    listLimiter.numToDisplay = 4;
    listLimiter.displayIncrement = 2;

    listLimiter.showMore();
    expect(listLimiter.numToDisplay).toBe(6);
  });

 it('should emit numdisplayed', () => {
    const listLimiter = new ListLimiterComponent();
    listLimiter.numToDisplay = 4;
    listLimiter.displayIncrement = 2;
    let outNumDisplayed;
    listLimiter.numDisplayed.subscribe((value) => outNumDisplayed = value);

    listLimiter.showMore();
    expect(outNumDisplayed).toBe(6);
  });

  it('should indicate if the list contains more to display', () => {
    const listLimiter = new ListLimiterComponent();
    listLimiter.listCount = 8;
    listLimiter.numToDisplay = 4;
    listLimiter.displayIncrement = 4;
    expect(listLimiter.isMore).toBe(true);

    listLimiter.showMore();
    expect(listLimiter.isMore).toBe(false);
  });

});
