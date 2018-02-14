import { AppPage } from './app.po';
import { browser, element, by, ElementFinder } from 'protractor';

describe('Migration Workbench App Page', () => {

  let page;
  const getPage = () => {
    page = new AppPage();
    page.navigateTo();
    browser.driver.sleep(500);
  };
  beforeAll(() => {
    getPage();
  });

  it('should display the top navigation menu', () => {
    expect( page.getNavigationMenu()).toBeTruthy();
  });

  it('should have a navigation brand', () => {
    expect<any>(page.getNavigationMenu_Brand()).toEqual('Migration Workbench');
  });

  it('should have navigation menu items', () => {
    const menuItems = [ 'Dashboard', 'Validations', 'Referential Integrity',
                        'Clinics', 'Team Tasks', 'Login' ];
    expect<any>(page.getNavigationMenu_MenuItems()).toEqual(menuItems);
  });

});
