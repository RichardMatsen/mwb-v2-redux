/* eslint-disable no-undef */

describe('Navigating to Profile Page', () => {

  describe('navigating to, when user is logged in', () => {
    it('should go to tasks page', () => {
      cy.setCurrentUser()
      cy.visit('/')
      cy.get('a[href*="profile"]').contains('Admin').click()
      cy.get('h1').contains('Profile')
    });
  });

});

describe('Profile Page', () => {

  before(() => {
    cy.setCurrentUser()
    cy.visit('/')
    cy.get('a[href*="profile"]').contains('Admin').click()
  });

  it('should have a title', () => {
    cy.get('.profile h1').contains('Profile')
  });

  describe('edit form and save data', () => {
    it('should have a first name input', () => {
      cy.get('input').eq(0).type('{selectall}').type('{del}').type('Sammy')
      cy.get('input').eq(0).then(x => console.log('x', x))
      cy.get('input').should('have.value', 'Sammy')
    });
    it('should have a last name input', () => {
      cy.get('input').eq(1).type('{selectall}').type('{del}').type('Smithson')
      cy.get('input').eq(1).should('have.value', 'Smithson')
    });
    it('should have a password input', () => {
      cy.get('input').eq(2).type('{selectall}').type('{del}').type('another password')
      cy.get('input').eq(2).should('have.value', 'another password')
    });
    it('should save the new data and display Toastr', () => {
      cy.get('button').eq(2).contains('Save').click()
      cy.get('div.toast-message').should('exist')
      cy.wait(200)
      cy.get('a[href*="profile"]').contains('Sammy')
    })
    it('returns to the Dashboard page', () => {
      cy.url().should('eq', `${Cypress.config('baseUrl')}/dashboard`)      
    })
  })

  describe('edit form and cancel', () => {
    before(() => {
      cy.wait(2000)
      cy.get('a[href*="user/profile"]').click()
      cy.wait(2000)
    });
    it('should have a first name input', () => {
      cy.get('input').eq(0).type('{selectall}').type('{del}').type('Johnny')
    });
    it('should save the new data', () => {
      cy.get('button').eq(3).contains('Cancel').click()
      cy.wait(200)
      cy.get('a[href*="profile"]').contains('Sammy')
    })
    it('returns to the Dashboard page', () => {
      cy.url().should('eq', `${Cypress.config('baseUrl')}/dashboard`)      
    })
  })

  describe('logout button', () => {
    before(() => {
      cy.get('a[href*="profile"]').click()
      cy.wait(2000)
    });
    it('should logout', () => {
      cy.get('button').eq(1).contains('Logout').click()
      cy.wait(200)
      cy.get('a[href*="login"]').contains('Login')
    })
    it('returns to the Dashboard page', () => {
      cy.url().should('eq', `${Cypress.config('baseUrl')}/dashboard`)      
    })
  })

});
