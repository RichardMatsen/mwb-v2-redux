import { browser, element, by, ElementFinder, ElementArrayFinder, promise } from 'protractor';

import { AppPage } from './app.po';
import { LoginPage } from './login.po';

export class TasksPage {

  navigateTo() {
    return browser.get('/tasks', 15000);
  }

  getTitleText(): promise.Promise<string> {
    return element(by.css('mwb-tasks h1')).getText();
  }

  getKanbanLists(): ElementArrayFinder {
    return element.all(by.css('mwb-kanban-list'));
  }

  getKanbanLists_Titles(): promise.Promise<string[]> {
    return element.all(by.css('.list_title'))
      .map(el => el.getText());
  }

  getKanbanLists_NewCardLink(): ElementArrayFinder {
    return element.all(by.css('.list__newcard'));
  }

  getKanbanCards(): ElementArrayFinder {
    return element.all(by.css('mwb-kanban-card'));
  }

  getKanbanCardsByList(listNo): ElementArrayFinder {
    const list = element.all(by.css('mwb-kanban-list')).get(listNo);
    return list.all(by.css('mwb-kanban-card'));
  }

}
