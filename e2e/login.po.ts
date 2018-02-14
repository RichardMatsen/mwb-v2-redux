import { browser, element, by } from 'protractor';

export class LoginPage {

  navigateTo() {
    return browser.get('/login', 15000);
  }

  enterSmithAsLoginName() {
    element(by.id('userName')).sendKeys('Smith');
  }

  clickLoginButton() {
    element.all(by.css('button.btn.btn-primary'))
      .then(x => { x[0].click(); });
  }

  login() {
    this.enterSmithAsLoginName();
    this.clickLoginButton();
  }

}
