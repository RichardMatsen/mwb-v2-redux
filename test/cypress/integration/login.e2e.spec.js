describe('Login Page', () => {

  describe('clicking login from the home page', () => {
    it('should go to the login page', () => {
      cy.visit(`/`)
      cy.get('a[href*="login"]').contains('Login').click()
      cy.get('h1').contains('Login')
    });
  });

});
