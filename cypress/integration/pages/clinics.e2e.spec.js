import { page_common_e2e } from '../../support/page.common.e2e.runner'

const runtimeConfig = require('../../../src/data/migration-workbench.config');

const clinicsTestParams = {
  testName: 'Clinics Page',
  pageUrl: 'localhost:4200/clinics',
  pageWait: 5000,
  config: runtimeConfig.clinicsConfig,
  countFilelist: 3,
  countAfterMoreChevronClick: 6,
  timesToClickUntilAllDisplayed: 1,
  expected: [
    {title: 'Clinics DB3 (03 Jun 2016)', time: '11:00', badgeValue: '99.53%', color: 'green'},
    {title: 'Clinics DB3 (01 Jun 2016)', time: '11:00', badgeValue: '98.31%', color: 'green'},
    {title: 'Clinics DB3 (26 May 2016)', time: '11:00', badgeValue: '94.66%', color: 'orange'},
  ],
  fileInitiallyLoaded: {
    title: 'Clinics DB3 (03 Jun 2016 - 11.00)',
    badgeText: '99.53% matched',
    badgeColor: 'green',
    zoom: '85%;'
  }
}

page_common_e2e(clinicsTestParams, runtimeConfig);





// const config = require('../../src/data/migration-workbench.config');

// import { 
//   colorMap, getColor_rgba, getColorClass,
//   getSelector, elementVerticalCenter, areAligned,
//   isLeftJustified, isRightJustified, areVerticallyCenterAligned
// } from '../support/common-utils'

// describe('Clinics Page', () => {

//   const getPage = () => {
//     cy.viewport((3000/1.5), (2000/1.5))
//     // cy.server()
//     // cy.route('/data/filelist.txt').as('filelist')
//     cy.visit('localhost:4200/clinics')
//     // cy.wait('@filelist')
//     // cy.route('/data/*.html').as('files')
//     // cy.wait('@files')
//     cy.wait(2000)
//   }

//   before(function(){
//     getPage()
//   })

//   context('static features', function(){

//     describe('title area', () => {

//       it('should have a main title text', () => {
//         cy.get('.pageTitle').should('contain', config.clinicsConfig.page.pageTitle)
//       });

//       it('should have a sub title text', () => {
//         cy.get('.pageDescription').should('contain', config.clinicsConfig.page.pageDescription)
//       });

//       it('should have a search control', () => {
//         cy.get('app-search').should('be.visible')
//       });
//     });
      
//     describe('file list', () => {

//       it('should have title text', () => {
//         cy.get('file-list h4.title').should('contain', config.clinicsConfig.page.listTitle)
//       });

//       it('should have a list of files', () => {
//         cy.get('.file-list-item').should('have.length', 3)
//       });
//     });
  
//     describe('file list items', () => {

//       const expected = [
//         {title: 'Clinics DB3 (03 Jun 2016)', time: '11:00', badgeValue: '99.53%', color: 'green'},
//         {title: 'Clinics DB3 (01 Jun 2016)', time: '11:00', badgeValue: '98.31%', color: 'green'},
//         {title: 'Clinics DB3 (26 May 2016)', time: '11:00', badgeValue: '94.66%', color: 'orange'},
//       ];
  
//       it('should have file title text', () => {
//         cy.get('.file-list-item span.title').arrayContains(expected.map(ex => ex.title))
//       });

//       it('should have file time text', () => {
//         cy.get('.file-list-item span.effectiveTime').arrayContains(expected.map(ex => ex.time))
//       });

//       it('should have metric badge', () => {
//         cy.get('.file-list-item error-badge span.badge').arrayContains(expected.map(ex => ex.badgeValue))
//       });

//       it('should have metric badge color css values', () => {
//         cy.get('.file-list-item error-badge span.badge')
//           .then(els => {
//             const colors = [...els].map(getColorClass)
//             expect(colors).to.deep.eq(expected.map(ex => ex.color))
//           })
//       });

//       it('should have badge color rgba values', () => {
//         cy.get('.file-list-item error-badge span.badge')
//           .then(els => {
//             const colors = [...els].map(el => getColor_rgba(el, colorMap))
//             expect(colors).to.deep.eq(expected.map(x => x.color))
//           })
//       })
//     });
    
//     describe('file list limiter', () => {

//       it('should show a limited list of files', () => {
//         cy.get('.file-list-item').should('have.length', 3)
//       });
  
//       it('should have a show-more icon to display more items', () => {
//         cy.get('span.moreChevron').should('be.visible')
//       });

//       it('the show-more icon should be enabled', () => {
//         cy.get('span.moreChevron').should('not.be.disabled')
//       });
//     });

//     describe('file display', () => {

//       describe('header', () => {

//         it('should have a title', () => {
//           cy.get('div.result .titleText').should('contain', 'Clinics DB3 (03 Jun 2016 - 11.00)')
//         });

//         it('should have metric badge', () => {
//           cy.get('div.result error-badge span.badge').should('contain', '99.53% matched')
//         });

//         it('should have metric badge of color', () => {
//           cy.get('div.result error-badge span.badge')
//             .then(els => {
//               const color = getColor_rgba(els[0], colorMap)
//               expect(color).to.eq('green')
//             })
//         });

//       });
  
//       describe('refresh button', () => {

//         it('should have a refresh button', () => {
//           cy.get('div.result a.refresh-page-button')
//         });

//         it('should have last refreshed text', () => {
//           cy.get('div.result .last-refresh-label')
//             .should('contain', 'Refreshed')
//             .should( function($el) {
//               expect($el[0].innerText.length).to.be.greaterThan(9)
//             })
//         });
//       });

//       describe('content', () => {

//         it('should have content', () => {
//           cy.get('#dataContainer')
//         });

//         it('should zoom content to 85%', () => {
//           cy.get('#dataContainer').should('have.attr', 'style', 'zoom: 85%;')
//         });
//       });

//     });
      
//   })

//   context('layout', function(){

//     describe('title area', () => {

//       describe('pageTitle', () => {
//         it('should be left-justified', () => {
//           isLeftJustified({ subject: '.pageTitle', relativeTo: '.bannertitle' })
//         })
//       })

//       describe('pageDescription', () => {
//         it('should be below title', () => {
//           const selectors = ['.pageTitle', '.pageDescription']
//           cy.get('body').selectorsAreOrdered(selectors)
//         });
//         it('should be left-justified', () => {
//           isLeftJustified({ subject: '.pageDescription', relativeTo: '.bannertitle' })
//         })
//       })

//       describe('search', () => {
//         it('should be vertically center-aligned to the page title', () => {
//           areVerticallyCenterAligned({ subjects: ['.pageTitle', 'app-search'], within: '.bannertitle' })
//         })
//         it('should be right-justified', () => {
//           isRightJustified({ subject: 'app-search', relativeTo: '.bannertitle' })
//         })
//       })

//     })

//     describe('file list', () => {
//       it('should be left-justified', () => {
//         isLeftJustified({ subject: 'file-list', relativeTo: '.filecontent' })
//       })
//     })

//     describe('result', () => {
//       it('should be right-justified', () => {
//         isRightJustified({ subject: '.result', relativeTo: '.filecontent' })
//       })
//     })

//   })

//   context('actions', function(){

//     beforeEach(() => {
//       getPage();
//     });

//   describe('file list limiter', () => {

//       describe('when show-more icon is clicked', () => {
  
//         it('should display more items', () => {
//           cy.get('span.moreChevron').should('be.visible').click()
//           cy.wait(300)
//           cy.get('.file-list-item').should('have.length', 6)
//         });
//       });
  
//       describe('when there are no more items to display', () => {
  
//         it('should disable the show-more icon', () => {
//           cy.get('span.moreChevron').should('not.be.disabled')
//           cy.get('span.moreChevron').should('be.visible').click()
//           cy.wait(300)
//           cy.get('span.moreChevron.disabled')
//         });
//       });
  
//     });

//     describe('file display', () => {
  
//       describe('when refresh button is clicked', () => {

//         it('should update last refreshed text', () => {
//           cy.get('.last-refresh-label span').then(spanBefore => {
//             const before = spanBefore[1].textContent;
//             cy.get('.refresh-page-button i').click()
//             cy.wait(300)
//             cy.get('.last-refresh-label span').then(spanAfter => {
//               const after = spanAfter[1].textContent;
//               expect(before).not.to.eq(after);
//             })
//           });
//         });
        
//       });
//     })

//   })
// })
