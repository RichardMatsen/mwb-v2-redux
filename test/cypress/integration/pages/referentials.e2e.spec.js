import * as d3 from 'd3';

import { page_common_e2e } from '../../support/page.common.e2e.runner'
import { getColor_rgba } from '../../support/color.utils'

const runtimeConfig = require('../../../../src/data/migration-workbench.config');

const referentialsTestParams = {
  testName: 'Referentials Page',
  pageUrl: `/referentials`,
  pageWait: 1000,
  config: runtimeConfig.referentialsConfig,
  countFilelist: 7,
  countAfterMoreChevronClick: 11,
  timesToClickUntilAllDisplayed: 4,
  expected: [
    {title: 'Emergency RI checks (03 Jul 2016)', time: '17:12', badgeValue: '0', color: 'green'},
    {title: '...', time: '15:12', badgeValue: '3', color: 'orange'},
    {title: 'Inpatient RI checks (03 Jul 2016)', time: '15:16', badgeValue: '31260', color: 'red'},
    {title: 'Maternity RI checks (03 Jul 2016)', time: '17:09', badgeValue: '0', color: 'green'},
    {title: 'MedicalRecord RI checks (03 Jul 2016)', time: '18:00', badgeValue: '0', color: 'green'},
    {title: 'Outpatient RI checks (03 Jul 2016)', time: '15:18', badgeValue: '0', color: 'green'},
    {title: 'PatientRecord RI checks (03 Jul 2016)', time: '16:01', badgeValue: '22', color: 'red'}
  ],
  fileInitiallyLoaded: {
    title: 'Emergency RI checks (03 Jul 2016 - 17.12)',
    badgeText: '0 errors',
    badgeColor: 'green',
    zoom: '100%;'
  }
}

page_common_e2e(referentialsTestParams, runtimeConfig);

before(function(){
  cy.viewport((3000/1.5), (2000/1.5))
  cy.visit(referentialsTestParams.pageUrl)
  cy.wait(referentialsTestParams.pageWait)
})

describe('Referentials extra features', () => {

  context('Referentials diagram button', () => {

    it('should hide referentials-diagram-modal', () => {
      cy.get('referentials-diagram-modal > .modal').should('not.be.visible')
    })
  
    it('should have a referentials diagram button', () => {
      cy.get('mwb-referentials-diagram').click()
      cy.get('mwb-referentials-diagram-modal > .modal').should('be.visible')
    })
  })

})
