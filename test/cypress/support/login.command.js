/* eslint-disable no-undef */

/*
  Commands to log in to the app
  loginMacro - perform login via UI
  setCurrentUser - set currentUser in localStorage (faster)
*/

Cypress.Commands.add('loginMacro',  (user, pwd) => {
  cy.visit('localhost:4200/login')
  cy.get('#userName').type(user);
  cy.get('#password').type(pwd);
  cy.get('button.btn.btn-primary').click()
})

Cypress.Commands.add('setCurrentUser',  () => {
  const testUser = {
    Id: 0,
    firstName: 'Admin',
    lastName: 'Admin',
    userName: 'Admin'
  }
  window.localStorage.setItem('currentUser', JSON.stringify(testUser));
})
