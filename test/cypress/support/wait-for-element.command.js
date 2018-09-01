/*
  Code adapted from https://github.com/azu/wait-for-element.js
  Original idea from https://github.com/Codeception/Codeception
*/

Cypress.Commands.add('waitForElement',  (selector, timeout) => {

  var timeoutOption = timeout || 2000;// 2s
  var loopTime = 100;
  var tryCount = 0;
  var limitCount = timeoutOption / loopTime;
  var limitCountOption = (limitCount < 1) ? 1 : limitCount;
  
  function tryCheck(resolve, reject) {
    if (tryCount < limitCountOption) {
      cy.get(selector).then(element => {
        if (element != null) {
          return element
        }
        setTimeout(function () {
          tryCheck(resolve, reject);
        }, loopTime);
      })
    } else {
      throw "Not found element match the selector: " + selector
    }
    tryCount++;
  }

  return tryCheck();

})
