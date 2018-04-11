import { 
  getCircleData, getPathData, 
  getTextData, getTextPathData, 
  getCirclesForPaths, getPathsForCircles,
  groupCount, groupBy
} from '../support/svg-helpers'

let svgRef;

describe('Referentials diagram', () => {

  before(function(){
    cy.viewport((3000/1.5), (2000/1.5))
    cy.visit('localhost:4200/referentials')
    cy.wait(5000)
    cy.get('mwb-referentials-diagram').click()
    cy.wait(500)
    // cy.get('svg').as('svgRef')
    cy.get('svg').then(svg => svgRef = svg)
  })
  
  context('Static', () => {

    // beforeEach(function() { cy.get('@svgRef').then(svgRef => { console.log('static: svgRef', svgRef) }) })
    beforeEach(function() { console.log('static: svgRef', this.svgRef) })

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

    // beforeEach(function() { cy.get('@svgRef').then(svgRef => { console.log('layout: svgRef', svgRef) }) })
    beforeEach(function() { console.log('static: svgRef', svgRef) })

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

      /// TODO: test the position of nodeLabel texts relative to their circles 
      /// - if leaf, should be right of node and vertically aligned
      /// - if non-leaf should be left of node and vertically above
      // it('texts should start and end at nodes', () => {
      //   cy.get('@circles').then(circles => {
      //     cy.get('@texts').then(texts => {
      //       const nodeLabels = texts.filter(text => text.groupedWith === 'circle')
      //       getCirclesForTexts(nodeLabels, circles)
      //     })
      //   })
      // })
    })

  })

})

