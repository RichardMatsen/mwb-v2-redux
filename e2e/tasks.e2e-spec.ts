/// <reference path="../node_modules/@types/jasmine-expect/index.d.ts"/>
// import { toStartWith } from 'jasmine-expect';  

import { TasksPage } from './tasks.po';
import { AppPage } from './app.po';
import { LoginPage } from './login.po';
import { browser, element, by, ElementFinder, ExpectedConditions } from 'protractor';
const EC = ExpectedConditions;

import { TestBed, async, inject, ComponentFixture } from '@angular/core/testing';
import { Location, CommonModule } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';

const config = require('../src/data/migration-workbench.config');

const startsWith = (actual, subString) => actual.slice(0, subString.length) === subString;

let tasksPage, appPage, loginPage;
// const getTasksPage = () => {
//   tasksPage = new TasksPage();
//   tasksPage.navigateTo();
//   browser.driver.sleep(500);
// };
const getAppPage = () => {
  appPage = new AppPage();
  appPage.navigateTo();
  browser.driver.sleep(500);
};
const getLoginPage = () => {
  loginPage = new LoginPage();
  loginPage.navigateTo();
  browser.driver.sleep(500);
};


describe('Navigating to Tasks Page', () => {

  beforeEach(() => {
    getAppPage();
  });

  describe('navigating to, when user is not logged in', () => {
    it('should redirect to login page', () => {
      const loginButtonText = appPage.getLoginMenuItem_Text();
      expect(loginButtonText).toEqual('Login');  // confirm user is not logged in.

      appPage.clickTasksMenuItem();
      const currentUrl = browser.getCurrentUrl()
        .then(url => {
          const path = url.split('?')[0].split('/').slice(-1)[0];
          const redirect = url.split('?')[1];
          expect(path).toBe('login');
          expect(redirect).toBe('returnUrl=%2Ftasks');
        })
    });
  });

  describe('navigating to, when user is logged in', () => {
    it('should go to tasks page', () => {
      getLoginPage();
      loginPage.login();
      appPage.clickTasksMenuItem();
      const currentUrl = browser.getCurrentUrl()
        .then(url => {
          const path = url.split('?')[0].split('/').slice(-1)[0];
          const redirect = url.split('?')[1];
          expect(path).toBe('tasks');
        });
    });
  });

});

describe('Tasks Page', () => {

  beforeEach(() => {
    tasksPage = new TasksPage();
    getAppPage();
    getLoginPage();
    loginPage.login();
    appPage.clickTasksMenuItem();
  });

  it('should have a title', () => {
    expect<any>(tasksPage.getTitleText()).toEqual('Tasks');
  });

  describe('Kanban lists', () => {

    it('should have four Kanban lists', () => {
      expect(tasksPage.getKanbanLists().count()).toEqual(4);
    });

    it('should have titles', () => {
      const titles = tasksPage.getKanbanLists_Titles();
      expect(titles).toEqual(['Unassigned', 'In Progress', 'Waiting', 'Done']);
    });

    it('should have new card links', () => {
      const newCardLinks = tasksPage.getKanbanLists_NewCardLink();
      expect(newCardLinks.count()).toEqual(4);
    });

    it('should have cards', () => {
      const cards = tasksPage.getKanbanCards();
      const descriptions = cards.map(x => x.getText());
      expect(cards.count()).toEqual(2);
      expect(descriptions).toEqual(['#1 - validations', '#2 - validations']);
    });

    it('should have one card on list #1', () => {
      const cards = tasksPage.getKanbanCardsByList(0);
      expect(cards.count()).toEqual(1);
    });

    it('should have one card on list #2', () => {
      const cards = tasksPage.getKanbanCardsByList(1);
      expect(cards.count()).toEqual(1);
    });

    describe('drag and drop', () => {
      /*
        Ref: https://github.com/angular/protractor/issues/583
             https://github.com/PloughingAByteField/html-dnd
             https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations
      */

      it('should drag and drop', () => {
        const card = tasksPage.getKanbanCardsByList(0).get(0);
        const draggable = card.all(by.css('p')).get(0);
        expect(draggable.getText()).toEqual('#1 - validations');

        const secondList = tasksPage.getKanbanLists().get(1);
        const droppable = secondList.all(by.css('div')).get(0);
        expect(droppable.all(by.css('.list_title')).get(0).getText()).toEqual('In Progress');

        const dragAndDrop = require('html-dnd').code;
        const offsetX = 0;
        const offsetY = 0;
        browser.executeScript(dragAndDrop, draggable, droppable, offsetX, offsetY);
        browser.sleep(3000);

        const cards = tasksPage.getKanbanCardsByList(1);
        expect(cards.count()).toEqual(2);

        const descriptions = cards.map(x => x.getText());
        expect(cards.count()).toEqual(2);
        expect(descriptions).toEqual(['#2 - validations', '#1 - validations']);
      });
    });

  });

});
