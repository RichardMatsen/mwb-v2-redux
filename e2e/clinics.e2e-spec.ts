/// <reference path="../node_modules/@types/jasmine-expect/index.d.ts"/>
// import { toStartWith } from 'jasmine-expect';  

import { ClinicsPage } from './clinics.po';
import { browser, element, by, ElementFinder, ExpectedConditions } from 'protractor';
const EC = ExpectedConditions;

import { TestBed, async, inject, ComponentFixture } from '@angular/core/testing';
import { Location, CommonModule } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';

const config = require('../src/data/migration-workbench.config');

const startsWith = (actual, subString) => actual.slice(0, subString.length) === subString;

describe('Clinics Page', () => {

  let page;
  const getPage = () => {
    page = new ClinicsPage();
    page.navigateTo();
    browser.driver.sleep(500);
  };
  beforeAll(() => {
    getPage();
  });

  const expected = [
    {title: 'Clinics DB3 (03 Jun 2016)', time: '11:00', badgeValue: '99.53%', color: 'green'},
    {title: 'Clinics DB3 (01 Jun 2016)', time: '11:00', badgeValue: '98.31%', color: 'green'},
    {title: 'Clinics DB3 (26 May 2016)', time: '11:00', badgeValue: '94.66%', color: 'orange'},
  ];

  describe('title area', () => {

    it('should have a main title text', () => {
      expect<any>(page.titleText()).toEqual(config.clinicsConfig.page.pageTitle);
    });

    it('should have a sub title text', () => {
      expect<any>(page.subTitleText()).toEqual(config.clinicsConfig.page.pageDescription);
    });

    it('should have a search control', () => {
      expect(page.searchForm().isDisplayed()).toBe(true);
    });
  });

  describe('file list', () => {

    it('should have title text', () => {
      expect(page.fileList_Title()).toEqual(config.clinicsConfig.page.listTitle);
    });

    it('should have a list of files', () => {
      expect(page.fileListItems_Count()).toBe(3);
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
      expect(page.fileListItems_Count()).toBe(3);
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
        expect(page.fileListItems_Count()).toBe(6);
      });
    });

    describe('when there are no more items to display', () => {

      beforeEach(() => {
        getPage();
        page.clickMoreChevron();
        browser.driver.sleep(300);
      });

      it('should disable the show-more icon', () => {
        expect(page.getMoreChevronIsDisabled()).toBe(true);
      });
    });

  });

  describe('file display', () => {

    describe('header', () => {

      it('should have a title', () => {
        expect(page.resultsHeaderTitle()).toEqual('Clinics DB3 (03 Jun 2016 - 11.00)');
      });

      it('should have metric badge', () => {
        expect(page.resultsHeaderMetric()).toEqual('99.53% matched');
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
