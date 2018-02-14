
describe('Migration Workbench App Page', () => {

  before(function(){
    cy.visit('localhost:4200')
  })

  it('should have a title', () => {
    cy.title().should('contain', 'MwbV2Redux')
  });

  context('Navigation', function(){
  
    it('should have a navbar', () => {
      cy.get('.navbar').should('be.visible')
    });

    it('should have a navigation brand', () => {
      cy.get('.navbar-brand').should('be.visible')
    });

    it('should have navigation menu items', () => {
      const menuItems = [ 'Dashboard', 'Validations', 'Referential Integrity',
                          'Clinics', 'Team Tasks', 'Login' ];
      cy.get('.navbar').get('li').then(values => {
        const texts = [...values].map(val => val.textContent.trim())
        expect(texts).to.deep.eq(menuItems)
      })
    });
  });
});
