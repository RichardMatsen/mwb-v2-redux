import { 
  colorMap, getColor_rgba, getColorClass,
  getSelector, elementVerticalCenter, areAligned,
  isLeftJustified, isRightJustified, areVerticallyCenterAligned
} from '../../support/common-utils'

export function page_common_e2e(testParams, runtimeConfig) {

  describe(testParams.testName, () => {

    const getPage = () => {
      cy.viewport((3000/1.5), (2000/1.5))
      cy.visit(testParams.pageUrl)
      cy.wait(testParams.pageWait)
    }

    before(function(){
      getPage()
    })

    context('static features', function(){

      describe('title area', () => {

        it('should have a main title text', () => {
          cy.get('.pageTitle').should('contain', testParams.config.page.pageTitle)
        });

        it('should have a sub title text', () => {
          cy.get('.pageDescription').should('contain', testParams.config.page.pageDescription)
        });

        it('should have a search control', () => {
          cy.get('mwb-search').should('be.visible')
        });
      });
        
      describe('file list', () => {

        it('should have title text', () => {
          cy.get('mwb-file-list h4.title').should('contain', testParams.config.page.listTitle)
        });

        it('should have a list of files', () => {
          cy.get('.file-list-item').should('have.length', testParams.countFilelist)
        });
      });
    
      describe('file list items', () => {

        it('should have file title text', () => {
          cy.get('.file-list-item span.title').arrayContains(testParams.expected.map(ex => ex.title))
        });

        it('should have file time text', () => {
          cy.get('.file-list-item span.effectiveTime').arrayContains(testParams.expected.map(ex => ex.time))
        });

        it('should have metric badge', () => {
          cy.get('.file-list-item error-badge span.badge').arrayContains(testParams.expected.map(ex => ex.badgeValue))
        });

        it('should have metric badge color css values', () => {
          cy.get('.file-list-item error-badge span.badge')
            .then(els => {
              const colors = [...els].map(getColorClass)
              expect(colors).to.deep.eq(testParams.expected.map(ex => ex.color))
            })
        });

        it('should have badge color rgba values', () => {
          cy.get('.file-list-item error-badge span.badge')
            .then(els => {
              const colors = [...els].map(el => getColor_rgba(el, colorMap))
              expect(colors).to.deep.eq(testParams.expected.map(x => x.color))
            })
        })
      });
      
      describe('file list limiter', () => {

        it('should show a limited list of files', () => {
          cy.get('.file-list-item').should('have.length', testParams.countFilelist)
        });
    
        it('should have a show-more icon to display more items', () => {
          cy.get('span.moreChevron').should('be.visible')
        });

        it('the show-more icon should be enabled', () => {
          cy.get('span.moreChevron').should('not.be.disabled')
        });
      });

      describe('file display', () => {

        describe('header', () => {

          it('should have a title', () => {
            cy.get('div.result .titleText').should('contain', testParams.fileInitiallyLoaded.title)
          });

          it('should have metric badge', () => {
            cy.get('div.result error-badge span.badge').should('contain', testParams.fileInitiallyLoaded.badgeText)
          });

          it('should have metric badge of color', () => {
            cy.get('div.result error-badge span.badge')
              .then(els => {
                const color = getColor_rgba(els[0], colorMap)
                expect(color).to.eq(testParams.fileInitiallyLoaded.badgeColor)
              })
          });

        });
    
        describe('refresh button', () => {

          it('should have a refresh button', () => {
            cy.get('div.result a.refresh-page-button')
          });

          it('should have last refreshed text', () => {
            cy.get('div.result .last-refresh-label')
              .should('contain', 'Refreshed')
              .should( function($el) {
                expect($el[0].innerText.length).to.be.greaterThan(9)
              })
          });
        });

        describe('content', () => {

          it('should have content', () => {
            cy.get('#dataContainer')
          });

          it(`should zoom content to ${testParams.fileInitiallyLoaded.zoom}`, () => {
            cy.get('#dataContainer').should('have.attr', 'style', `zoom: ${testParams.fileInitiallyLoaded.zoom}`)
          });
        });

      });
        
    })

    context('layout', function(){

      describe('title area', () => {

        describe('pageTitle', () => {
          it('should be left-justified', () => {
            isLeftJustified({ subject: '.pageTitle', relativeTo: '.bannertitle' })
          })
        })

        describe('pageDescription', () => {
          it('should be below title', () => {
            const selectors = ['.pageTitle', '.pageDescription']
            cy.get('body').selectorsAreOrdered(selectors)
          });
          it('should be left-justified', () => {
            isLeftJustified({ subject: '.pageDescription', relativeTo: '.bannertitle' })
          })
        })

        describe('search', () => {
          it('should be vertically center-aligned to the page title', () => {
            areVerticallyCenterAligned({ subjects: ['.pageTitle', 'mwb-search'], within: '.bannertitle' })
          })
          it('should be right-justified', () => {
            isRightJustified({ subject: 'mwb-search', relativeTo: '.bannertitle' })
          })
        })

      })

      describe('file list', () => {
        it('should be left-justified', () => {
          isLeftJustified({ subject: 'mwb-file-list', relativeTo: '.filecontent' })
        })
      })

      describe('result', () => {
        it('should be right-justified', () => {
          isRightJustified({ subject: '.result', relativeTo: '.filecontent' })
        })
      })

    })

    context('actions', function(){

      beforeEach(() => {
        getPage();
      });

    describe('file list limiter', () => {

        describe('when show-more icon is clicked', () => {
    
          it('should display more items', () => {
            cy.get('span.moreChevron').should('be.visible').click()
            cy.wait(300)
            cy.get('.file-list-item').should('have.length', testParams.countAfterMoreChevronClick)
          });
        });
    
        describe('when there are no more items to display', () => {
    
          it('should disable the show-more icon', () => {
            cy.get('span.moreChevron').should('not.be.disabled')

            var i;
            for (i = 0; i < testParams.timesToClickUntilAllDisplayed; i++) { 
              cy.get('span.moreChevron').should('be.visible').click()
              cy.wait(100)
            }
            cy.get('span.moreChevron.disabled')
          });
        });
    
      });

      describe('file display', () => {
    
        describe('when refresh button is clicked', () => {

          it('should update last refreshed text', () => {
            cy.get('.lastRefreshTime').then(spans => {
              const before = spans[0].textContent;
              expect(before.length).to.be.above(0);
              cy.wait(1000)
              cy.get('.refresh-page-button i').click()
              cy.get('.last-refresh-label span.lastRefreshTime').then(spans => {
                const after = spans[0].textContent;
                expect(after.length).to.be.above(0);
                expect(before).not.to.eq(after);
              })
            });
          });
        });
      })

    })
  })

}
