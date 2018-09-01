

export const getSelector = (el, selectors) => {
  const ids = [...el.className.split(' ').map(cn => `.${cn}`), el.localName]
  return ids.filter(id => selectors.includes(id) && id !== '.')[0]
}

Cypress.Commands.add('selectorsAreOrdered', { prevSubject: 'element' },  (parent, selectors) => {
  cy.wrap(parent).find(selectors.join(', ')).then(els => {
    const sortedSelectors = [...els].map(el => getSelector(el, selectors))
    expect(selectors).to.deep.eq(sortedSelectors, `Selectors: [${selectors}] are ordered`)
  })
})

export const elementVerticalCenter = (el) => el.offsetTop + Math.floor(el.offsetHeight / 2)

export const areAligned = (els) => {
  const first = els[0];
  return els.every(el => Math.abs(el - first) <= 1) // allow one pixel difference
}

export const isLeftJustified = ({ subject, relativeTo, maxPadding }) => {
  const selectors = `${subject}, ${relativeTo}`
  cy.get(selectors)
    .getProp('offsetLeft')
    .then(offsetsetLefts => {
      expect(Math.abs(offsetsetLefts[0] - offsetsetLefts[1]) <= (maxPadding || 15)).to.be.true
    })
}

export const isRightJustified = ({ subject, relativeTo, maxPadding }) => {
  const selectors = `${subject}, ${relativeTo}`
  cy.get(selectors)
    .calcProps(['offsetLeft', 'offsetWidth'], (vals) => vals[0] + vals[1] )
    .then(offsetsetRights => {
      expect(offsetsetRights[0] - offsetsetRights[1] <= (maxPadding || 15)).to.be.true
    })
}

export const areVerticallyCenterAligned =  ({ subjects, within, maxPadding }) => {
  cy.get(within || 'body').each(el => {
    cy.wrap(el).find(subjects.join(', '))
      .then(children => {
        const vcs = [...children].map(child => elementVerticalCenter(child))
        expect(areAligned(vcs)).to.be.true
      })
  })
}
