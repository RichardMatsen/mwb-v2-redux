describe('Navigating to Tasks Page', () => {

  describe('navigating to, when user is not logged in', () => {
    it('should redirect to login page', () => {
      cy.visit('/')
      cy.get('a[href*="login"]').contains('Login').click()
      cy.get('h1').contains('Login')
    });
  });

  describe('navigating to, when user is logged in', () => {
    it('should go to tasks page', () => {
      cy.visit('/login')
      cy.get('#userName').type('Smith');
      cy.get('button.btn.btn-primary').click()

      cy.get('a[href*="tasks"]').contains('Team Tasks').click()
      cy.get('h1').contains('Tasks')
    });
  });

});

describe('Tasks Page', () => {

  before(() => {
    cy.setCurrentUser()
    cy.visit('/')
    cy.get('a[href*="tasks"]').contains('Team Tasks').click()
  });

  it('should have a title', () => {
    cy.get('mwb-tasks h1').contains('Tasks')
  });

  describe('Kanban lists', () => {

    it('should have four Kanban lists', () => {
      cy.get('mwb-kanban-list').count(4)
    });

    it('should have titles', () => {
      cy.get('.list_title').arrayContains(['Unassigned', 'In Progress', 'Waiting', 'Done'])
    });

    it('should have new card links', () => {
      cy.get('.list__newcard').count(4)
    });

    it('should have cards', () => {
      cy.get('mwb-kanban-card').count(11)
      cy.get('mwb-kanban-card').eq(0).arrayContains(['#1 - Validations'])
      cy.get('mwb-kanban-card').eq(1).arrayContains(['#2 - Validations [Jim]'])
    });

    it('should have one card on list #1', () => {
      cy.get('mwb-kanban-list').eq(0).within(() => {
        cy.root().get('mwb-kanban-card').count(1).contains('#1 - Validations')
      })
    });

    it('should have three cards on list #2', () => {
      cy.get('mwb-kanban-list').eq(1).within(els => {
        cy.root().get('mwb-kanban-card').count(3).contains('#2 - Validations [Jim]')
      })
    });

    describe('drag and drop', () => {
      /*
        Ref: https://github.com/angular/protractor/issues/583
             https://github.com/PloughingAByteField/html-dnd
             https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations
      */

      it('should drag and drop', () => {

        // Draggable
        cy.get('mwb-kanban-list').eq(0).within(els => {
          cy.root().get('p.card[draggable]')
            .count(1).contains('#1 - Validations')
            .as('draggable')
        })
        cy.get('@draggable').should('have.attr', 'draggable', 'true')

        // Droppable
        cy.get('mwb-kanban-list').eq(1)
          .as('droppable')
        // cy.get('@droppable').then(els => { console.log('droppable',els) })

        /*
          Drag and drop test.
          ------------------
          Ref: https://github.com/cypress-io/cypress/issues/845#issuecomment-353087850

          The component uses native HTML5 Drag and Drop, Ref: https://www.w3schools.com/HTML/html5_draganddrop.asp
          This utilizes an object with dataTransfer property to communicate between draggable and droppable components
          so we need to mock this object.
          Using this mock, just invoke the dragstart and drop events.

          This is essentially doing the same thing as the 'html-dnd' library used in the Karma spec
          Ref: https://github.com/Kuniwak/html-dnd/blob/b45d6e40e864a70094fa4a062e8b36ebb1d21536/src/html_dnd.ts

        */
        const dt = {
          types: [],
          setData: function (prop, val) {
            this[prop] = val
          },
          getData: function (prop) {
            return this[prop]
          }
        }
        cy.get('@draggable').trigger('dragstart', {
          dataTransfer: dt
        })
        cy.get('@droppable').trigger('drop', {
          dataTransfer: dt
        })

        // Check 2 cards on 2nd list
        cy.get('mwb-kanban-list').eq(1).within(els => {
          cy.root().get('p.card[draggable]')
            .count(4)
        })

        // Check no cards on first list
        cy.get('mwb-kanban-list').eq(0).within(els => {
          cy.root().get('p.card[draggable]').should('not.exist')
        })
      });

    });
  });

});
