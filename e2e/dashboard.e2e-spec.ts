import { DashboardPage } from './dashboard.po';
import { browser, element, by, ElementFinder, utils } from 'protractor';

import { TestBed, async, inject, ComponentFixture } from '@angular/core/testing';
import { Location, CommonModule } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';

describe('Dashboard Page', () => {

  let page;
  const getPage = () => {
    page = new DashboardPage();
    page.navigateTo();
    browser.driver.sleep(500);
  };
  beforeAll(() => {
    getPage();
  });

  it('should display Dashboard title', () => {
    expect<any>(page.getTitleText()).toEqual('Dashboard');
  });

  it('should have a list of thumbnails', () => {
    expect<any>( page.getDashboardThumbnails().count()).toBe(5);
  });

  describe('thumbnails', () => {

    const expected = [
      {title: 'Code Validations', icon: 'fa-check-square-o', badgeValue: '0', color: 'green'},
      {title: 'Referential Integrity', icon: 'fa-list-ol', badgeValue: '31285', color: 'red'},
      {title: 'Clinic Matching', icon: 'fa-medkit', badgeValue: '99.53%', color: 'green'},
      {title: 'Loading Exceptions', icon: 'fa-exclamation-triangle', badgeValue: '242', color: 'orange'},
      {title: 'Team Tasks', icon: 'fa-cogs', badgeValue: '23', color: 'blue'},
    ];

    it('should have titles', () => {
      const titles = expected.map(e => e.title);
      expect<any>(page.getDashboardThumbnails_Titles()).toEqual(titles);
    });

    it('should have icons', () => {
      const icons = expected.map(e => e.icon);
      expect<any>(page.getDashboardThumbnails_Icons()).toEqual(icons);
    });

    it('should have badges values', () => {
      const badgeValues = expected.map(e => e.badgeValue);
      expect<any>(page.getDashboardThumbnails_Badges()).toEqual(badgeValues);
    });

    it('should have badge colors', () => {
      const colors = expected.map(e => e.color);
      expect<any>(page.getDashboardThumbnails_BadgeColors()).toEqual(colors);
    });

    describe('narrative dropdown', () => {

      it('should have dropdown icons', () => {
        const narrative_icon = 'fa-chevron-down';
        expect<any>(page.getNarrativeDropdown_Icons_First()).toEqual(narrative_icon);
      });

      it('should not initially display the narrative text', () => {
        expect<any>(page.getNarrativeText_First().isDisplayed()).toBe(false);
      });

      describe('when narrative chevron down is clicked', () => {

        beforeAll(() => {
          page.clickNarrativeIcon(0);
        });

        afterAll(() => {
          page.clickNarrativeIcon(0); // Restore to closed state
        });

        it('should display the narrative text', () => {
          expect<any>(page.getNarrativeText_First().isDisplayed()).toBe(true);
        });

        it('should display the close icon', () => {
          const narrative_icon = 'fa-chevron-up';
          expect<any>(page.getNarrativeDropdown_Icons_First()).toEqual(narrative_icon);
        });
      });

      describe('when narrative chevron up is clicked', () => {

        beforeAll(() => {
          page.clickNarrativeIcon(0);  // Down
          page.clickNarrativeIcon(0);  // then up
        });

        it('should hide the narrative text', () => {
          expect<any>(page.getNarrativeText_First().isDisplayed()).toBe(false);
        });

        it('should display the dropdown icon', () => {
          const narrative_icon = 'fa-chevron-down';
          expect<any>(page.getNarrativeDropdown_Icons_First()).toEqual(narrative_icon);
        });
      });

    });

    describe('thumbnail navigation', () => {
      it('thumbnails should navigate', () => {
        page.clickDashboardThumbnail(0);
        page.getLocation().then( (location) => {
          expect(location).toContain('/validations');
        });
      });
    });

  });

});
