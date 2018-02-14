/// <reference path="../node_modules/@types/jasmine-expect/index.d.ts"/>
// import { toStartWith } from 'jasmine-expect';  

import { ValidationsPage } from './validations.po';
import { browser, element, by, ElementFinder, ExpectedConditions } from 'protractor';
const EC = ExpectedConditions;

import { TestBed, async, inject, ComponentFixture } from '@angular/core/testing';
import { Location, CommonModule } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';

const config = require('../src/data/migration-workbench.config');

const startsWith = (actual, subString) => actual.slice(0, subString.length) === subString;

describe('Validations Page', () => {

  let page;
  const getPage = () => {
    page = new ValidationsPage();
    page.navigateTo();
    browser.driver.sleep(500);
  };
  beforeAll(() => {
    getPage();
  });

  const expected = [
    {title: 'Volatile Validations 09 Jun 2016', time: '17:50', badgeValue: '0', color: 'green'},
    {title: '...', time: '12:10', badgeValue: '1', color: 'orange'},
    {title: '...', time: '10:05', badgeValue: '6', color: 'orange'},
    {title: 'Volatile Validations 06 Jun 2016', time: '', badgeValue: '35', color: 'red'},
    {title: 'Volatile Validations Appointments 24 May 2016 - DB1', time: '', badgeValue: '77', color: 'red'},
  ];

  describe('title area', () => {
    it('should have a main title text', () => {
      expect<any>(page.titleText()).toEqual(config.validationsConfig.page.pageTitle);
    });
    it('should have a sub title text', () => {
      expect<any>(page.subTitleText()).toEqual(config.validationsConfig.page.pageDescription);
    });
    it('should have a search control', () => {
      expect(page.searchForm().isDisplayed()).toBe(true);
    });
  });

  describe('file list', () => {
    it('should have title text', () => {
      expect(page.fileList_Title()).toEqual(config.validationsConfig.page.listTitle);
    });
    it('should have a list of files', () => {
      expect(page.fileListItems_Count()).toBe(5);
    });
  });

  describe('file list items', () => {
    it('should have file title text', () => {
      expect(page.fileListItems_Text()).toEqual(expected.map(ex => ex.title));
    });
    it('should have file time text', () => {
      expect(page.fileListItems_Time()).toEqual(expected.map(ex => ex.time));
    });
    it('should have metric badge', () => {
      expect(page.fileListItems_Metric()).toEqual(expected.map(ex => ex.badgeValue));
    });
    it('should have metric badge of color', () => {
      expect(page.fileListItems_Color()).toEqual(expected.map(ex => ex.color));
    });
  });

  describe('file list limiter', () => {

    it('should show a limited list of files', () => {
      expect(page.fileListItems_Count()).toBe(5);
    });
    it('should have a show-more icon to display more items', () => {
      expect(page.getMoreChevron().isDisplayed()).toBe(true);
    });
    it('the show-more icon should be enabled', () => {
      expect(page.getMoreChevronIsDisabled()).toBe(false);
    });

    describe('when show-more icon is clicked', () => {

      beforeEach(() => {
        page.clickMoreChevron();
        browser.driver.sleep(300);
      });

      it('should display more items', () => {
        expect(page.fileListItems_Count()).toBe(9);
      });
    });

    describe('when there are no more items to display', () => {

      beforeEach(() => {
        getPage();
        page.clickMoreChevron();
        browser.driver.sleep(300);
        page.clickMoreChevron();
        page.clickMoreChevron();
      });

      it('should disable the show-more icon', () => {
        expect(page.getMoreChevronIsDisabled()).toBe(true);
      });
    });

  });

  describe('file display', () => {
    describe('header', () => {
      it('should have a title', () => {
        expect(page.resultsHeaderTitle()).toEqual('Volatile Validations 09 Jun 2016 - 17.50');
      });
      it('should have metric badge', () => {
        expect(page.resultsHeaderMetric()).toEqual('0 errors');
      });
      it('should have metric badge of color', () => {
        expect(page.resultsHeaderMetricColor()).toEqual('green');
      });
    });

    describe('refresh button', () => {
      it('should have a refresh button', () => {
        expect(page.refreshButton().isPresent()).toBe(true);
      });
      it('should have last refreshed text', () => {
        expect<any>(page.lastRefreshedLabel()).toStartWith('Refreshed');
        expect<any>(page.lastRefreshedLabel().then(text => text.length)).toBeGreaterThan(9);
      });

      describe('when refresh button is clicked', () => {
        it('should update last refreshed text', () => {
          page.lastRefreshedLabel().then( before => {
            browser.driver.sleep(3000);
            browser.executeScript('arguments[0].click();', page.refreshButton());
            browser.driver.sleep(300);
            expect<any>(page.lastRefreshedLabel()).not.toEqual(before);
          });
        });
      });
    });

  });

});
