import { browser, element, by, ElementFinder, ElementArrayFinder, promise } from 'protractor';

export class DashboardPage {

  navigateTo() {
    browser.get('/dashboard');
  }

  getTitleText(): promise.Promise<string> {
    return element(by.css('mwb-dashboard h1')).getText();
  }

  getDashboardThumbnails(): ElementArrayFinder {
    return element.all(by.css('.thumbnail'));
  }

  getDashboardThumbnails_Titles(): promise.Promise<string[]> {
    return element.all(by.css('.thumbnail .title'))
      .map(el => el.getText());
  }

  getDashboardThumbnails_Icons(): promise.Promise<string[]> {
    return element.all(by.css('.thumbnail i.measure-icon'))
      .map(el => this.getFontAwesomeIconClass(el));
  }

  getDashboardThumbnails_Badges(): promise.Promise<string[]> {
    return element.all(by.css('.thumbnail .badge'))
      .map(el => el.getText());
  }

  getDashboardThumbnails_BadgeColors(): promise.Promise<string[]> {
    return element.all(by.css('.thumbnail .badge'))
      .map(el => this.getColor(el));
  }

  clickDashboardThumbnail(index) {
    element.all(by.css('.thumbnail a.measure'))
      .then(x => { x[index].click(); });
  }

  getLocation(): promise.Promise<string> {
    return browser.getCurrentUrl();
  }

  getNarrativeDropdown_Icons_First(): promise.Promise<string> {
    return element.all(by.css('i.narrative-icon'))
      .map(el => this.getFontAwesomeIconClass(el))
      .then((icons: string[]) => icons[0]);
  }

  clickNarrativeIcon(index) {
    element.all(by.css('.thumbnail a.narrative-button')).get(index).click();
    browser.driver.sleep(500);
  }

  getNarrativeText_First(): ElementFinder {
    return element.all(by.css('.narrative-text')).get(0);
  }

  private getFontAwesomeIconClass(el: ElementFinder) {
    const faSizes = ['fa-sm', 'fa-md', 'fa-lg', 'fa-2x', 'fa-3x', 'fa-4x', 'fa-5x'];
    return el.getAttribute('class')
      .then( (classes) => {
        return classes.split(' ')
          .filter(cl => cl.substr(0, 3) === 'fa-' && !faSizes.includes(cl))[0];
      });
  }

  private getColor(el: ElementFinder) {
    const colorMap =  {'rgba(0, 255, 127, 1)': 'green', 'rgba(255, 140, 0, 1)': 'orange',
                       'rgba(205, 92, 92, 1)': 'red', 'rgba(0, 0, 255, 1)': 'blue', 'rgba(119, 136, 153, 1)': 'grey'};
    return el.getCssValue('background-color').then((rgba) => {
      return colorMap[rgba];
    });
  }

}
