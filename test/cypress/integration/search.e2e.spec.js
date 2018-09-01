/* eslint-disable no-undef */

describe('Search', () => {

  const getPage = () => {
    cy.viewport((3000/1.5), (2000/1.5))
    cy.visit('localhost:4200/validations')
    cy.wait(100)
  }

  before(() => {
    getPage()
  })

  context('when search term is typed', () => {

    afterEach(() => {
      cy.get('#searchTerm').clear()
    })

    it('should display the search indicator in the header', () => {
      cy.get('#searchTerm').type('diagnosis')
      cy.get('.search-indicator').should('be.visible')
      cy.get('.search-indicator').contains('2')
    })

    it('should mark the searchterm in content', () => {
      cy.get('#searchTerm').type('diagnosis')
      cy.get('mark.markSearch').should('have.length', 2)
    })
  })  

  context('when search term is cleared', () => {

    beforeEach(() => {
      cy.get('#searchTerm').type('diagnosis')
    })

    afterEach(() => {
      cy.get('#searchTerm').clear()
    })

    it('should hide the search indicator in the header', () => {
      cy.get('.reset').click()
      cy.wait(100)
      cy.get('.search-indicator').should('not.be.visible')
    })

    it('should unmark the searchterm in content', () => {
      cy.get('.reset').click()
      cy.get('mark.markSearch').should('have.length', 0)
    })
  })  

  context('when search button is clicked', () => {

    beforeEach(() => {
      cy.get('#searchTerm').type('XYZ123')
      cy.get('button').contains('Search').click()
    })

    it('should display the results modal', () => {
      cy.get('div.modal-container').should('be.visible')
      cy.get('a.list-group-item').should('have.length', 2)
      cy.get('button.close').click()

      cy.get('#searchTerm').clear()
    })

    it('should display icons in the file list where match is found', () => {
      cy.get('mwb-file-list li.file-list-item').should('have.length', 5)
      cy.get('button.close').click()
      cy.get('mwb-file-list search-indicator').should('have.length', 2)
    })
  })  
})
