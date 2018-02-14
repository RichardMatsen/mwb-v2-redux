import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { referentialsGraphModel as graph } from '../referentials-graph.model';
declare var require;
require('testing-helpers/d3.helpers/d3.helpers');

@Injectable()
export class ReferentialsGraphDrawLinksService {

  public drawLinks(currentNode) {

    const linkData = graph.rootNode.links();
    const linkSelect = graph.svg.selectAll('path.link')
      .data(linkData, (d) => d.target.data.id);
    const linkContainers = linkSelect
      .enter()
      .insert('g', 'g')    // 2nd param puts links before nodes, so node is above link in z-order
      .attr('class', 'link');

    this.drawPath(linkContainers, currentNode);
    this.drawPathText(linkContainers);
    this.updatePathText();
    this.drawTransition(linkSelect, currentNode);
  }


  private drawPath(linkEnter, currentNode) {
    const paths = linkEnter.append('path')
      .attr('class', 'link')
      .attr('id', function (d, i) { return d.target.data.id; })
      .style('fill', graph.links.fill)
      .style('stroke', graph.links.stroke)
      .style('stroke-width', graph.links.strokewidth)
      .attr('d', (d) => {
        const o = {x: currentNode.x0, y: currentNode.y0};
        return graph.diagonal(o, o);
      })
      .transition()
      .duration(graph.duration)
      .attr('d', (d) => graph.diagonal(d.source, d.target));
    return paths;
  }

  private drawPathText(linkEnter) {
    const opacity =  graph.links.showPathText ? 1 : 1e-6;
    const textPaths = linkEnter.append('text')
      .attr('x', 60)
      .attr('dy', 4)
      .append('svg:textPath')
      .attr('id', function (d, i) { return 'TP' + d.target.data.id; })
      .attr('class', 'textpath')
      .attr('fill', '#910f00')
      .style('font-size', 10)
      .style('fill-opacity', opacity)
      .attr('xlink:href', (d, i) => '#' + d.target.data.id)
      .text((d, i) => d.target.data.parent_FK ? d.target.data.parent_FK.join(', ') : '');
    return textPaths;
  }

  public updatePathText() {
    const opacity =  graph.links.showPathText ? 1 : 1e-6;
    const textPathUpdates = graph.svg
      .selectAll('textpath')
      .style('fill-opacity', opacity );
    return textPathUpdates;
  }

  private drawTransition(linkSelect, currentNode) {
    linkSelect
      .transition()
      .duration(graph.duration)
      .attr('d', (d) => {
        return graph.diagonal(d.source, d.target);
      });

    // Transition exiting nodes to the parent's new position.
    linkSelect
      .exit()
      .transition()
      .duration(graph.duration)
      .attr('d', (d) => {
          const o = {x: currentNode.x, y: currentNode.y};
          return graph.diagonal(o, o);
      });
  }

  // private selectAndCount(title, tag) {
  //   const s = graph.svg.selectAll(tag)
  //   console.log(title, s.size())
  // }

}
