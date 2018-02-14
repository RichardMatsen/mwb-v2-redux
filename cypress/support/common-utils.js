
export const colorClasses = ['red', 'orange', 'green', 'blue', 'gray'];

export const getColorClass = el => el.className.split(' ')
  .filter(cl => { return colorClasses.includes(cl); })[0];

/*
  Ref: https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
      https://www.w3schools.com/css/css_image_transparency.asp
*/
export const colorMap =  {'rgba(0, 255, 127, 0.8)': 'green', 'rgba(255, 140, 0, 0.8)': 'orange',
        'rgba(205, 92, 92, 0.8)': 'red', 'rgba(0, 0, 255, 0.8)': 'blue', 'rgba(119, 136, 153, 0.8)': 'grey'};

export const getColor_rgba = (el) => {
  const rgb = window.getComputedStyle(el, null)['background-color']
  const alpha = window.getComputedStyle(el, null)['opacity']
  const rgba = `rgba(${ rgb.substring(4).substr(0, rgb.length-5)}, ${alpha})`
  return colorMap[rgba];
}

export const getSelector = (el, selectors) => {
  const ids = [...el.className.split(' ').map(cn => `.${cn}`), el.localName]
  return ids.filter(id => selectors.includes(id) && id !== '.')[0]
}

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

