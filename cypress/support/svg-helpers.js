
const circleFillColorMap =  {
  'rgb(255, 255, 255)': 'white', 
  'rgb(176, 196, 222)': 'blue',
  'rgb(144, 238, 144)': 'green', 
  'rgb(255, 0, 0)': 'red', 
  'rgb(255, 165, 0)': 'orange'
};

export const getCircleData = (el) => {
  const fillRgb = window.getComputedStyle(el, null)['fill']
  const bounds = el.getBoundingClientRect()
  const center = { x: Math.round(bounds.left + (bounds.width / 2)), y: Math.round(bounds.top + (bounds.height / 2))} 
  return { center, fill: circleFillColorMap[fillRgb] }
}

export const groupBy = (arr, keyFn) => {
  const grouped = arr.reduce( (grouping, item) => {
    const key = keyFn(item);
    grouping[key] = grouping[key] || [];
    grouping[key].push(item);
    return grouping;
  }, {} );
  return grouped;
}

export const groupCount = (grouped) => {
  Object.keys(grouped).forEach(key => {
    grouped[key] = grouped[key].length; 
  })
  return grouped;
}

// Ref: https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
//      https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d
//      https://www.dashingd3js.com/svg-paths-and-d3jshttps://www.dashingd3js.com/svg-paths-and-d3js
export const getPathData = (el) => {
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

export const getTextData = (el) => {
  const bounds = el.getBoundingClientRect()
  const groupedWith = el.parentNode.childNodes[0].tagName
  return { groupedWith, bounds }
}

export const getTextPathData = (el) => {
  const bounds = el.getBoundingClientRect()
  const groupedWith = el.parentNode.parentNode.childNodes[0].tagName
  const fillOpacity = window.getComputedStyle(el, null)['fill-opacity']
  return { groupedWith, fillOpacity }
}

export const getCirclesForPaths = (paths, circles) => {
  paths.forEach(path => {
    const cStart = circles.filter(c => c.center.x == path.vector.start.x && c.center.y == path.vector.start.y )
    const cEnd = circles.filter(c => c.center.x == path.vector.end.x && c.center.y == path.vector.end.y )
    path.nodes = { 
      start: cStart.length ? cStart[0] : null,
      end: cEnd.length ? cEnd[0] : null
    } 
  })
}

export const getPathsForCircles = (paths, circles) => {
  circles.forEach(circle => {
    const pathsOut = paths.filter(p => circle.center.x == p.vector.start.x && circle.center.y == p.vector.start.y )
    const pathsIn = paths.filter(p => circle.center.x == p.vector.end.x && circle.center.y == p.vector.end.y )
    circle.pathOrder = { pathsOut: pathsOut.length, pathsIn: pathsIn.length,  isLeaf: !pathsOut.length, isRoot: !pathsIn.length } 
  })
}
