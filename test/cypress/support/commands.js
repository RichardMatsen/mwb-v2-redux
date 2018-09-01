// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

require('./login.command')
require('./wait-for-element.command.js')
require('./layout.utils.js')

Cypress.Commands.add("cleanUpXHR", function() {
  cy.visit(`$localhost:4200/404`, { failOnStatusCode: false });
})

Cypress.Commands.add('nth', { prevSubject: 'element' },  (els, index) => {
  return cy.wrap([...els][index]) 
})

Cypress.Commands.add('count', { prevSubject: 'element' },  (els, expected) => {
  expect([...els].length).to.eq(expected)
})



Cypress.Commands.add('prop', { prevSubject: 'element' },  (el, prop) => el[0][prop] )
/*  E.g -  cy.get('.thumbnail .badge').nth(2).prop('offsetLeft').should('be.eq', 1169) */

Cypress.Commands.add('getProp', { prevSubject: 'element' },  (els, prop) => {
  return [...els].map(el => el[prop] )
});

Cypress.Commands.add('getProps', { prevSubject: 'element' },  (els, props) => {
  return [...els].map(el => props.map(prop => el[prop]) )
});

Cypress.Commands.add('calcProps', { prevSubject: 'element' },  (els, props, convert) => {
  return [...els].map(el => {
    const vals = props.map(prop => el[prop]) 
    return convert(vals)
  })
});

Cypress.Commands.add('getComputedProp', { prevSubject: 'element' },  (els, prop) => {
  return [...els].map(el => {
    return window.getComputedStyle(el, null)[prop]
  })
});

// const getSelector = (el, selectors) => {
//   const ids = [...el.className.split(' ').map(cn => `.${cn}`), el.localName]
//   return ids.filter(id => selectors.includes(id) && id !== '.')[0]
// }

// Cypress.Commands.add('selectorsAreOrdered', { prevSubject: 'element' },  (parent, selectors) => {
//   cy.wrap(parent).find(selectors.join(', ')).then(els => {
//     const sortedSelectors = [...els].map(el => getSelector(el, selectors))
//     expect(selectors).to.deep.eq(sortedSelectors, `Selectors: [${selectors}] are ordered`)
//   })
// })

const getText = el => el.textContent.trim()

Cypress.Commands.add('arrayContains', { prevSubject: 'element'}, (actuals, expecteds) => {
  const texts = [...actuals].map(getText)
  expect(texts).to.deep.eq(expecteds)
})

Cypress.Commands.add('checkNth', { prevSubject: 'element' },  (els, index, check) =>  {
  return cy.wrap([...els][index])
    .should(check)
})

