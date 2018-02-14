
import { 
  colorMap, getColor_rgba, getColorClass,
  getSelector, elementVerticalCenter, areAligned
} from '../support/common-utils'

describe('Dashboard Page', () => {

  before(function(){
    cy.viewport((3000/1.5), (2000/1.5))
    cy.server()
    cy.route('/data/filelist.txt').as('filelist')
    cy.visit('localhost:4200')
    cy.wait('@filelist')
    // cy.route('/data/*.html').as('files')
    // cy.wait('@files')
    cy.wait(5000)
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

      it('should have a list of thumnails', () => {
        cy.get('.thumbnail').should('have.length', 5)
      });
    });

    context('thumbnails', () => {

      const expected = [
        {title: 'Code Validations', icon: 'fa-check-square-o', badgeValue: '0', color: 'green'},
        {title: 'Referential Integrity', icon: 'fa-list-ol', badgeValue: '31285', color: 'red'},
        {title: 'Loading Exceptions', icon: 'fa-exclamation-triangle', badgeValue: '242', color: 'orange'},
        {title: 'Clinic Matching', icon: 'fa-medkit', badgeValue: '99.53%', color: 'green'},
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
            console.log(els)
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
        // const elementVerticalCenter = (el) => el.offsetTop + Math.floor(el.offsetHeight / 2)
  
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
              const fillerWidth = [...children][selectors.indexOf('.filler')].offsetWidth;
              expect(gaps.every(gap => gap < 50)).to.be.true
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
              cy.wait(500)
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
              cy.wait(500)
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

      beforeEach(() => {
        cy.viewport((3000/1.5), (2000/1.5))
        cy.visit('localhost:4200')
      })

      it('thumbnails should navigate', () => {
        cy.get('.thumbnail a.measure').first().click()
        cy.location().should((loc) => {
          expect(loc.href).to.eq('http://localhost:4200/validations')
        })
        // const expectedLocs = [
        //   'http://localhost:4200/validations',
        //   'http://localhost:4200/referentials',
        //   'http://localhost:4200/clinics',
        //   'http://localhost:4200/login?returnUrl=%2Ftasks'
        // ]
        // cy.get('.thumbnail a.measure')
        //   .each((el,i) => {
        //     cy.wrap(el).click();
        //     cy.location().should((loc) => {
        //       expect(loc.href).to.eq(expectedLocs[i])
        //     })
        //     cy.go('back');
        //   })
      });
    });

  })

});

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