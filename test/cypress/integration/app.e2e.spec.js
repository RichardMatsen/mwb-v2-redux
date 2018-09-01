describe('Migration Workbench App Page', () => {

  before(() => {
    cy.server()
    cy.route('GET', '/data/*').as('data')
    cy.visit('/', {
      onLoad(win) {
        console.log('onLoad', win)
      }
    })
    cy.window().then(win => {
      console.log('cy.window()', win)
    })
    // This fails
    // cy.wait('@data').then(x => expect(x.url).to.eq('http://localhost:4200//data/Volatile%20Validations%2009%20Jun%202016%20-%2017.50.html'))
    // cy.wait('@data', {timeout:10000}).then(x => console.log(x))
    cy.contains('99.53%', { // wait for some content to indicate loading is complete
      timeout: 10000
    })
  })

  it('should have a title', () => {
    cy.title().should('contain', 'MwbV2Redux')
  });

  context('Navigation', function () {

    it('should have a navbar', () => {
      cy.get('.navbar').should('be.visible')
    });

    it('should have a navigation brand', () => {
      cy.get('.navbar-brand').should('be.visible')
    });

    it('should have navigation menu items', () => {
      const menuItems = ['Dashboard', 'Validations', 'Referential Integrity',
        'Clinics', 'Team Tasks', 'Login'
      ];
      cy.get('.navbar').get('li').then(values => {
        const texts = [...values].map(val => val.textContent.trim())
        expect(texts).to.deep.eq(menuItems)
      })
    });
  });
});