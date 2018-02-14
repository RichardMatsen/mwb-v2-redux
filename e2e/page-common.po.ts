import { browser, element, by, ElementFinder, ElementArrayFinder, promise } from 'protractor';

export abstract class PageCommon {

  abstract url: string;
  abstract selector: string;

  navigateTo() {
    browser.get(this.url);
  }

  titleText(): promise.Promise<string> {
    return element(by.css(this.selector + ' h1.pageTitle')).getText();
  }

  subTitleText(): promise.Promise<string> {
    return element(by.css(this.selector + ' span.pageDescription')).getText();
  }

  searchForm(): ElementFinder {
    return element(by.css('app-search'));
  }

  fileList_Title(): promise.Promise<string> {
    return element(by.css('file-list h4.title')).getText();
  }

  fileListItems_Count(): promise.Promise<number> {
    return element.all(by.css('.file-list-item')).count();
  }

  fileListItems_Text(): promise.Promise<string[]> {
    return element.all(by.css('.file-list-item span.title'))
      .map(el => el.getText());
  }

  fileListItems_Time(): promise.Promise<string[]> {
    return element.all(by.css('.file-list-item span.effectiveTime'))
      .map(el => el.getText());
  }

  fileListItems_Metric(): promise.Promise<string[]> {
    return element.all(by.css('.file-list-item error-badge span.badge'))
      .map(el => el.getText());
  }

  fileListItems_Color(): promise.Promise<string[]> {
    return element.all(by.css('.file-list-item error-badge span.badge'))
      .map(el => this.getColor(el));
  }

  getMoreChevron(): ElementFinder {
    return element(by.css('span.moreChevron'));
  }

  clickMoreChevron() {
    element(by.css('span.moreChevron a')).click();
  }

  getMoreChevronIsDisabled(): promise.Promise<boolean> {
    return this.hasDisabledClass(element(by.css('span.moreChevron')));
  }


  resultsHeaderTitle(): promise.Promise<string> {
    return element(by.css('div.result .titleText')).getText();
  }

  resultsHeaderMetric(): promise.Promise<string> {
    return element(by.css('div.result error-badge span.badge')).getText();
  }

  resultsHeaderMetricColor(): promise.Promise<string> {
    return element.all(by.css('div.result error-badge span.badge'))
      .map(el => this.getColor(el))
      .then((colors: string[]) => colors[0]);
  }

  refreshButton(): ElementFinder {
    return element(by.css('div.result a.refresh-page-button'));
  }

  lastRefreshedLabel(): promise.Promise<string> {
    return element(by.css('div.result .last-refresh-label')).getText();
  }

  private getColor(el: ElementFinder) {
    const colorMap =  {'rgba(0, 255, 127, 1)': 'green', 'rgba(255, 140, 0, 1)': 'orange',
                       'rgba(205, 92, 92, 1)': 'red', 'rgba(0, 0, 255, 1)': 'blue', 'rgba(119, 136, 153, 1)': 'grey'};
    return el.getCssValue('background-color').then((rgba) => {
      return colorMap[rgba];
    });
  }

  private hasDisabledClass(el: ElementFinder): promise.Promise<boolean> {
    return el.getAttribute('class')
      .then( (classes: string) => {
        return classes.split(' ').includes('disabled');
      });
  }
}
