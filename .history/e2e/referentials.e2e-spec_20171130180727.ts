import { ReferentialsPage } from './referentials.po';
import { browser, element, by, ElementFinder, ExpectedConditions } from 'protractor';
const EC = ExpectedConditions;

// import { toStartWith } from 'jasmine-expect';
// import { toStartWith } from '../node_modules/jasmine-expect';
// import JasmineExpect from 'jasmine-expect';

import { TestBed, async, inject, ComponentFixture } from '@angular/core/testing';
import { Location, CommonModule } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';

const startsWith = (actual, subString) => actual.slice(0, subString.length) === subString;

describe('Referentials Page', () => {

  let page;
  const getPage = () => {
    page = new ReferentialsPage();
    page.navigateTo();
    browser.driver.sleep(500);
  };
  beforeAll(() => {
    getPage();
  });

  const expected = [
    {title: 'Emergency RI checks (03 Jul 2016)', time: '17:12', badgeValue: '0', color: 'green'},
    {title: '...', time: '15:12', badgeValue: '3', color: 'orange'},
    {title: 'Inpatient RI checks (03 Jul 2016)', time: '15:16', badgeValue: '31260', color: 'red'},
    {title: 'Maternity RI checks (03 Jul 2016)', time: '17:09', badgeValue: '0', color: 'green'},
    {title: 'MedicalRecord RI checks (03 Jul 2016)', time: '18:00', badgeValue: '0', color: 'green'},
    {title: 'Outpatient RI checks (03 Jul 2016)', time: '15:18', badgeValue: '0', color: 'green'},
    {title: 'PatientRecord RI checks (03 Jul 2016)', time: '16:01', badgeValue: '22', color: 'red'},
  ];

  describe('title area', () => {
    it('should have a main title text', () => {
      expect<any>(page.titleText()).toEqual('Referential Integrity Checks');
    });
    it('should have a sub title text', () => {
      expect<any>(page.subTitleText().then(text => text.length)).toBeGreaterThan(10);
    });
    it('should have a search control', () => {
      expect(page.searchForm().isDisplayed()).toBe(true);
    });
    it('should have a diagram button', () => {
      expect(page.diagramButton().isDisplayed()).toBe(true);
    });
  });

  describe('file list', () => {

    it('should have title text', () => {
      expect(page.fileList_Title()).toEqual('Choose Ri Check');
    });

    it('should have a list of files', () => {
      expect(page.fileListItems_Count()).toBe(7);
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
      expect(page.fileListItems_Count()).toBe(7);
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
        expect(page.fileListItems_Count()).toBe(11);
      });

    });

    describe('when there are no more items to display', () => {

      beforeEach(() => {
        getPage();
        page.clickMoreChevron();
        browser.driver.sleep(300);
        page.clickMoreChevron();
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
        expect(page.resultsHeaderTitle()).toEqual('Emergency RI checks (03 Jul 2016 - 17.12)');
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
