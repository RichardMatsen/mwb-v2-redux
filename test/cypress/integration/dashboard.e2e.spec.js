
import { 
  colorMap, getColor_rgba, getColorClass
} from '../support/color.utils'
import { 
  getSelector, elementVerticalCenter, areAligned
} from '../support/layout.utils'

describe('Dashboard Page', () => {

  before(function(){
    load_page()
  })

  context('static features', function(){

    context('Dashboard', function(){

      it('should display Dashboard title', () => {
        cy.get('.dashboard>h1').should('contain', 'Dashboard')
      });

      it('should display sub title', () => {
        cy.get('.dashboard>span').should('contain', 'Summary of')
      });

      it('should display a horizontal rule', () => {
        cy.get('.dashboard>hr')
      });

      it('should have a list of thumbnails', () => {
        cy.get('.thumbnail').should('have.length', 5)
      });
    });

    context('thumbnails', () => {

      const expected = [
        {title: 'Code Validations', icon: 'fa-check-square-o', badgeValue: '0', color: 'green'},
        {title: 'Referential Integrity', icon: 'fa-list-ol', badgeValue: '31285', color: 'red'},
        {title: 'Clinic Matching', icon: 'fa-medkit', badgeValue: '99.53%', color: 'green'},
        {title: 'Loading Exceptions', icon: 'fa-exclamation-triangle', badgeValue: '242', color: 'orange'},
        {title: 'Team Tasks', icon: 'fa-cogs', badgeValue: '23', color: 'blue'},
      ];
      const getText = el => el.textContent.trim()

      it('should have titles', () => {
        cy.get('.thumbnail .title').then(els => {
          const texts = [...els].map(getText)
          expect(texts).to.deep.eq(expected.map(x => x.title))
        })
      });

      it('should have icons', () => {
        cy.get('.thumbnail .measure-icon').then(els => {
          const icons = [...els].map(getIcon)
          expect(icons).to.deep.eq(expected.map(x => x.icon))
        })
      });

      it('should have sparklines', () => {
        cy.get('.thumbnail sparkline').should('have.length', 5)
      });

      it('should have badges', () => {
        cy.get('.thumbnail .badge').should('have.length', 5)
      });

      describe('sparklines', () => {
        it('should have polyline', () => {
          cy.get('.thumbnail sparkline svg polyline').should('have.length', 5)
        });
        it('should have points', () => {
          cy.get('.thumbnail sparkline svg polyline').then(polylines => {
            const points = [...polylines].map(p => p.points)
            expect(points.map(p => p.length)).to.deep.eq([9,3,6,7,0])
          })
        });
        it('should have polyline points with x-scale 0 to 100', () => {
          cy.get('.thumbnail svg polyline').then(polylines => {
            [...polylines].forEach((polyline, index) => {
              if (polyline.points.length) {
                expect(polyline.points[0].x).to.eq(0)
                expect(polyline.points[polyline.points.length - 1].x).to.eq(100)
              }
            })
          })
        });
      });

      describe('badges', () => {

        it('should have badge value', () => {
          cy.get('.thumbnail .badge').then(els => {
            const badges = [...els].map(getText)
            expect(badges).to.deep.eq(expected.map(x => x.badgeValue))
          })
        });

        it('should have badge color css values', () => {
          cy.get('.thumbnail .badge').then(els => {
            const colors = [...els].map(getColorClass)
            expect(colors).to.deep.eq(expected.map(x => x.color))
          })
        });
  
        it('should have badge color rgba values', () => {
          cy.get('.thumbnail .badge').then(els => {
            const colors = [...els].map(getColor_rgba)
            expect(colors).to.deep.eq(expected.map(x => x.color))
          })
        });
      });

      describe('narrative dropdown', () => {
        it('should have dropdown icons', () => {
          cy.get('.thumbnail .narrative-icon').should('have.length', 4)
        });

        it('should display the open icon', () => {
          cy.get('.thumbnail .narrative-icon').then(els => {
            const icons = [...els].map(getIcon)
            expect(icons).to.deep.eq(Array(4).fill('fa-chevron-down'))
          })
        });
  
        it('should not initially display the narrative text', () => {
          cy.get('.thumbnail .narrative-text')
            .each((el,i) => {
              cy.wrap(el).should('not.be.visible')
            })
        });
  
      });

    });

  });

  context('layout', () => {

    beforeEach(function () {
      cy.viewport((3000/1.5), (2000/1.5))
    })

    describe('Dashboard page content', () => {

      const selectors = ['.page-title', '.subtitle', '.titles-rule', '.thumbnails']

      it('should be in correct order', () => {
        cy.get('.dashboard').selectorsAreOrdered(selectors)
      });

    })
    
    describe('Thumbnail content', () => {

      const selectors = ['.measure-icon','.title', '.filler', 'sparkline', '.badge']

      it('should display thumbnail contents in order', () => {
        cy.get('.thumbnail').each(el => {
          cy.wrap(el).selectorsAreOrdered(selectors)
        })
      })
  
      it('should vertically align to center the thumbnail contents', () => {
        cy.get('.thumbnail').each(el => {
          cy.wrap(el).find(selectors.join(', '))
            .then(children => {
              const sortedSelectors = [...children].map(el => getSelector(el, selectors))
              const vcs = [...children].map(child => elementVerticalCenter(child))
              expect(areAligned(vcs)).to.be.true
            })
        })
      })
  
      it('should left and right justify thumbnail contents', () => {
        cy.get('.thumbnail').each(el => {
          cy.wrap(el).find(selectors.join(', '))
            .then(children => {
              const lrbounds = [...children].map(child => { return { left: child.offsetLeft, right: child.offsetLeft + child.offsetWidth }})
              const gaps = lrbounds.map((bounds, i) => i === 0 ? bounds.left : Math.floor(bounds.left - lrbounds[i-1].right )) 
              expect(gaps.every(gap => gap < 50)).to.be.true

              const fillerWidth = [...children][selectors.indexOf('.filler')].offsetWidth;
              expect(fillerWidth).to.be.greaterThan(500)
            })
        })
      })
    })

  })

  context('actions', () => {

    describe('narrative dropdown', () => {

      describe('when narrative chevron down is clicked', () => {

        it('should display the narrative text', () => {
          cy.get('.thumbnail .narrative-button')
            .each((button,i) => {
              checkNth(`.thumbnail .narrative-text`, i, 'not.be.visible')
              cy.wrap(button).click()
              checkNth(`.thumbnail .narrative-text`, i, 'be.visible')
            })
        });

        it('should display the close icon', () => {
          cy.get('.thumbnail .narrative-icon').then(els => {
            const icons = [...els].map(getIcon)
            expect(icons).to.deep.eq(Array(4).fill('fa-chevron-up'))
          })
        });
      });

      describe('when narrative chevron up is clicked', () => {

        it('should hide the narrative text', () => {
          cy.get('.thumbnail .narrative-button')
            .each((button,i) => {
              checkNth(`.thumbnail .narrative-text`, i, 'be.visible')
              cy.wrap(button).click()
              checkNth(`.thumbnail .narrative-text`, i, 'not.be.visible')
            })
        });

        it('should display the dropdown icon', () => {
          cy.get('.thumbnail .narrative-icon').then(els => {
            const icons = [...els].map(getIcon)
            expect(icons).to.deep.eq(Array(4).fill('fa-chevron-down'))
          })
        });
      });

    });

    describe('thumbnail navigation', () => {

      ['validations', 'referentials', 'clinics'].forEach((page, index) => {

        it(`should navigate to '${page}'`, () => {
          cy.get('.thumbnail a.measure').eq(index).click()
          cy.location().should((loc) => {
            expect(loc.href).to.eq(`${Cypress.config('baseUrl')}/${page}`)
          })
          cy.go('back')
        });

      })
    });

  })

});

const load_page = () => {
  cy.viewport((3000/1.5), (2000/1.5))
  cy.visit('/')
  cy.contains('99.53%', {timeout: 5000})  // wait for the last metric to get calculated text
}

const getIcon = (el) => {
  const faSizes = ['fa-sm', 'fa-md', 'fa-lg', 'fa-2x', 'fa-3x', 'fa-4x', 'fa-5x'];
  return el.className.split(' ')
    .filter(cl => { return cl.substr(0, 3) === 'fa-' && !faSizes.includes(cl); })[0];
}

const checkNth = (selector, n, check) => {
  cy.get(selector).then( els => {
    cy.wrap([...els][n])
      .should(check)
  })
}
