
const circleFilleColorMap =  {
  'rgb(255, 255, 255)': 'white', 
  'rgb(176, 196, 222)': 'blue',
  'rgb(144, 238, 144)': 'green', 
  'rgb(255, 0, 0)': 'red', 
  'rgb(255, 165, 0)': 'orange'
};

const getCircleData = (el) => {
  const fillRgb = window.getComputedStyle(el, null)['fill']
  const bounds = el.getBoundingClientRect()
  const center = { x: Math.round(bounds.left + (bounds.width / 2)), y: Math.round(bounds.top + (bounds.height / 2))} 
  return { center, fill: circleFilleColorMap[fillRgb] }
}

const groupBy = (arr, keyFn) => {
  const grouped = arr.reduce( (grouping, item) => {
    const key = keyFn(item);
    grouping[key] = grouping[key] || [];
    grouping[key].push(item);
    return grouping;
  }, {} );
  return grouped;
}

const groupCount = (grouped) => {
  Object.keys(grouped).forEach(key => {
    grouped[key] = grouped[key].length; 
  })
  return grouped;
}

// Ref: https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
//      https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d
//      https://www.dashingd3js.com/svg-paths-and-d3jshttps://www.dashingd3js.com/svg-paths-and-d3js
const getPathData = (el) => {
  const pathString = window.getComputedStyle(el, null)['d'];
  const split = pathString
    .substring(6, pathString.length -2)
    .split(' ')
    .map(s => isNaN(s) ? s : Math.round(s) )
  const moveTo = { x: split[1], y: split[2] };
  const cubicCurve = { 
    control1: { x: split[4], y: split[5] },
    control2: { x: split[6], y: split[7] },
    end: { x: split[8], y: split[9] },
  };
  const bounds = el.getBoundingClientRect()
  const direction = { x: Math.sign(cubicCurve.end.x - moveTo.x), y: Math.sign(cubicCurve.end.y - moveTo.y) }
  const vector = { 
    start: { x: Math.round(bounds.x), y: direction.y > 0 ? Math.round(bounds.top) : Math.round(bounds.bottom) },
    end: { x: Math.round(bounds.x + bounds.width), y: direction.y > 0 ? Math.round(bounds.bottom) : Math.round(bounds.top) }
  }
  return { vector };
}

const getTextData = (el) => {
  const bounds = el.getBoundingClientRect()
  const groupedWith = el.parentNode.childNodes[0].tagName
  return { groupedWith, bounds }
}

const getTextPathData = (el) => {
  const bounds = el.getBoundingClientRect()
  const groupedWith = el.parentNode.parentNode.childNodes[0].tagName
  const fillOpacity = window.getComputedStyle(el, null)['fill-opacity']
  return { groupedWith, fillOpacity }
}

const getCirclesForPaths = (paths, circles) => {
  paths.forEach(path => {
    const cStart = circles.filter(c => c.center.x == path.vector.start.x && c.center.y == path.vector.start.y )
    const cEnd = circles.filter(c => c.center.x == path.vector.end.x && c.center.y == path.vector.end.y )
    path.nodes = { 
      start: cStart.length ? cStart[0] : null,
      end: cEnd.length ? cEnd[0] : null
    } 
  })
}

const getPathsForCircles = (paths, circles) => {
  circles.forEach(circle => {
    const pathsOut = paths.filter(p => circle.center.x == p.vector.start.x && circle.center.y == p.vector.start.y )
    const pathsIn = paths.filter(p => circle.center.x == p.vector.end.x && circle.center.y == p.vector.end.y )
    circle.pathOrder = { pathsOut: pathsOut.length, pathsIn: pathsIn.length,  isLeaf: !pathsOut.length, isRoot: !pathsIn.length } 
  })
}

const getCirclesForTexts = (nodeLabels, circles) => {
  nodeLabels.forEach(nodeLabel => {
    const cStart = circles.filter(c => c.center.x == path.vector.start.x && c.center.y == path.vector.start.y )
    const cEnd = circles.filter(c => c.center.x == path.vector.end.x && c.center.y == path.vector.end.y )
    path.nodes = { 
      start: cStart.length ? cStart[0] : null,
      end: cEnd.length ? cEnd[0] : null
    } 
  })
}

before(function(){
  cy.viewport((3000/1.5), (2000/1.5))
  cy.visit('localhost:4200/referentials')
  cy.wait(5000)
  cy.get('app-referentials-diagram').click()
  cy.wait(500)
})

describe('Referentials diagram', () => {

  context('Static', () => {

    it('should have an SVG element', () => {
      cy.get('svg')
    })

    it('should have a title', () => {
      cy.get('div#footer h2').contains('Extract Referential Integrity');
    })

    it('should have hint text', () => {
      cy.get('div#footer div.hint p').contains('Green: ok, Red: errors, Orange: child has errors');
    })

    it('should have circles', () => {
      cy.get('svg circle').count(42);
    })
  
    it('circles should have color', () => {
      cy.get('svg circle').then(circles => {
        const circleData = [...circles].map(getCircleData)
        const colorGroups = groupCount(groupBy(circleData, circle => circle.fill));
        expect(colorGroups).to.deep.eq({white: 1, blue: 29, green: 7, red: 2, orange: 3})
      })
    })
  
    it('should have paths', () => {
      cy.get('svg path').count(41);
    })
  
    it('should have texts', () => {
      cy.get('svg text').count(83);
    })
  
    it('should have 42 texts grouped with circles', () => {
      cy.get('svg text').then(texts => {
        const data = [...texts].map(getTextData)
        expect(data.filter(d => d.groupedWith === 'circle').length).to.eq(42)
      });
    })
  
    it('should have 41 texts grouped with paths', () => {
      cy.get('svg text').then(texts => {
        const data = [...texts].map(getTextData)
        expect(data.filter(d => d.groupedWith === 'path').length).to.eq(41)
      });
    })
  
    it('should have textPaths', () => {
      cy.get('svg textPath').count(41);
    })
  
    it('textPaths should not be visible', () => {
      cy.get('svg textPath').then(textPaths => {
        const data = [...textPaths].map(getTextPathData)
        expect(data.map(tp => tp.fillOpacity).every(fo => fo < 0.01)).to.eq(true)
      });
    })
  
  })

  context('Layout', () => {

    beforeEach(() => {

      cy.get('svg circle').then(circleObjs => {
        const circles = [...circleObjs].map(getCircleData)
        const xCoords = groupBy(circles, circle => circle.center.x);
        const levels = Object.keys(xCoords).map((key, index) => {
          return { level: index, x: key, nodeCount: xCoords[key].length }
        })
        cy.wrap(circles).as('circles')
        cy.wrap(levels).as('levels')
      })

      cy.get('svg path').then(pathObjs => {
        const paths = [...pathObjs].map(getPathData) 
        cy.wrap(paths).as('paths')
      })

      cy.get('svg text').then(textObjs => {
        const texts = [...textObjs].map(getTextData) 
        cy.wrap(texts).as('texts')
      })

    })

    describe('Levels', () => {

      it('should have 5 horizontal levels', () => {
        cy.get('@levels').then(levels => 
          expect(levels.length).to.eq(5)
        )
      })
  
      it('should have 150px level spacing', () => {
        cy.get('@levels').then(levels => {
          const spacing = levels.reduce((acc, item, index, array) => {
            return index === 0 ? acc : acc.concat(item.x - array[index-1].x)
          }, [])
          expect(spacing.every(space => space === 150)).to.eq(true)
        })
      })

      it('should have nodeCounts [1, 5, 9, 23, 4]', () => {
        cy.get('@levels').then(levels => 
          expect(levels.map(l => l.nodeCount)).to.deep.eq([1, 5, 9, 23, 4])
        )
      })

    })

    describe('Connections', () => {

      it('paths should start and end at nodes', () => {
        cy.get('@circles').then(circles => {
          cy.get('@paths').then(paths => {
            getCirclesForPaths(paths, circles)
            expect(paths.every(path => path.nodes.start && path.nodes.end)).to.eq(true)
          })
        })
      })

      it('circles should have 1 root, 14 middle and 27 leaf nodes', () => {
        cy.get('@circles').then(circles => {
          cy.get('@paths').then(paths => {
            getPathsForCircles(paths, circles)
            expect(circles.filter(c => c.pathOrder.isRoot).length).to.eq(1)
            expect(circles.filter(c => !c.pathOrder.isRoot && !c.pathOrder.isLeaf).length).to.eq(14)
            expect(circles.filter(c => c.pathOrder.isLeaf).length).to.eq(27)
          })
        })
      })

      it('texts should start and end at nodes', () => {
        cy.get('@circles').then(circles => {
          cy.get('@texts').then(texts => {
            const nodeLabels = texts.filter(text => text.groupedWith === 'circle')
            getCirclesForTexts(nodeLabels, circles)
          })
        })
    })
  })

})

