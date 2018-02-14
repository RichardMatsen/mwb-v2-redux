import * as d3 from 'd3';

/*
  Example:
  svg.selectAll("path.link")
    .data(linkData, (d) => { return d.target.data.id; });
    .append("path")
    .attr("class", "link")
    .logSize('drawPath')
    // if transitioning, do so after .logSize()
    .transition()
    .duration(graph.duration)
    .attr('d', (d) => { return graph.diagonal(d.source, d.target) })
*/

d3.selection.prototype['logSize'] = function(title = '') {
  console.log(title, 'Size: ', this.size());
  return this;
};
