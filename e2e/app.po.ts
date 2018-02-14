import { browser, element, by } from 'protractor';

export class AppPage {

  navigateTo() {
    return browser.get('/dashboard', 15000);
  }

  getNavigationMenu() {
    return element(by.css('nav-bar'));
  }

  getNavigationMenu_Brand() {
    return element(by.css('.navbar-brand')).getText();
  }

  getTasksMenuItem() {
    return element(by.css('a[href*="task"]'));
  }

  clickTasksMenuItem() {
    element.all(by.css('a[href*="tasks"]'))
      .then(x => { x[0].click(); });
  }

  getLoginMenuItem_Text() {
    return element(by.css('a[href*="login"]')).getText();
  }

  clickLoginMenuItem() {
    element.all(by.css('a[href*="login"]'))
      .then(x => { x[0].click(); });
  }

  getNavigationMenu_MenuItems() {
    return element.all(by.css('ul.nav li a'))
      // .map(item=> item.getText());
      /*
         Ref: https://github.com/angular/protractor/issues/1794
         Using .getText() does not work for the **nested** li elements, although they are found by the query
         Presume getText() is returning only visible text (the two sub menu items are hidden by default).
      */
      .map(item => item.getAttribute('text')
      .then(text => {
        return text.trim();
      }));
  }

}
