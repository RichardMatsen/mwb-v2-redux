import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { referentialsGraphModel as graph } from '../referentials-graph.model';

@Injectable()
export class ReferentialsGraphDrawNodesService {

  public drawNodes(source) {
    const nodes = this.positionNodes();
    const nodeSelect = graph.svg.selectAll('g.node')
      .data(nodes, this.getId );
    this.refreshNodes(nodeSelect, source);
    return nodes;
  }

  private positionNodes() {
    graph.treeMap(graph.rootNode);
    const nodes = graph.rootNode.descendants().reverse();
    nodes.forEach( (node) => {
      this.setYAxisFromLevelDepths(node);
    });
    return nodes;
  }

  private setYAxisFromLevelDepths(node) {
    node.y = graph.levelDepths.slice(0, node.depth + 1)
      .reduce((a, b) => a + b, graph.yOffset);
  }

  private getId(d) {
    return d.data.id || (d.data.id = ++graph.nodeId);
  }

  private refreshNodes(nodeSelect, source) {
    this.addNewNodes(nodeSelect, source);
    this.updateNodes(nodeSelect);
    this.removeNodes(nodeSelect, source);
  }

  private addNewNodes(nodeSelect, source) {
    const nodeEnter = nodeSelect.enter().append('svg:g')
      .attr('class', 'node')
      .on('click', (d) => { graph.nodeClick(d); });

    this.addTransition(nodeEnter, source);
    this.addCircles(nodeEnter);
    this.addText(nodeEnter);
    this.addTooltips(nodeEnter);
  }

  private addTransition(nodeEnter, source) {
    // Transition from clicked node (or root at start) to final position
    nodeEnter
      .attr('transform', function(d) { return 'translate(' + source.y + ',' + source.x + ')'; })
      .transition()
      .duration(graph.duration)
      .attr('transform', function(d) { return 'translate(' + d.y + ',' + d.x + ')'; });
  }

  private addCircles(nodeEnter) {
    nodeEnter.append('svg:circle')
      .attr('r', graph.circle.radius)
      .attr('cursor', (d) => d.depth < 2 ? 'pointer' : 'default')
      .attr('stroke', graph.circle.stroke)
      .attr('stroke-width', graph.circle.strokeWidth)
      .style('fill', (d) => d.data.color || graph.circle.fill);
  }

  private addText(nodeEnter) {
    nodeEnter.append('svg:text')
      .attr('dx', function(d) { return d.children ? '0em' : '1em'; })
      .attr('dy', function(d) { return d.children ? '-1.35em' : '0.35em'; })
      .style('text-anchor', (d) => d.children ? 'end' : 'start')
      .text((d) => d.data.name)
      .style('color', 'black')
      .style('font-size', graph.text.fontsize);
  }

  private addTooltips(nodeEnter) {
    const divRelation = d3.select('div.relation');
    const divRelationText = d3.select('div.relation .relation-text');
    nodeEnter.selectAll('circle')
      .on('mouseover', (d) => {
        if (!d.data.relation) { return; }
        divRelation.transition()
          .duration(200)
          .style('opacity', .7);
        divRelationText.html( d.data.relation );
      })
      .on('mouseout', (d) => {
        divRelation.transition()
          .duration(500)
          .style('opacity', 0);
      });
  }

  private updateNodes(nodeSelect) {
    const nodeUpdate = nodeSelect.transition()
      .duration(graph.duration)
      .attr('transform', (d) => 'translate(' + d.y + ',' + d.x + ')');

    nodeUpdate.select('circle')
      .attr('r', graph.circle.radius)
      .style('fill', (d) => d.data.color || graph.circle.fill);

    nodeUpdate.select('text')
      .style('fill-opacity', 1);
  }

  private removeNodes(nodeSelect, source) {
    const nodeExit = nodeSelect.exit()
      .transition()
      .duration(graph.duration)
      .attr('transform', function(d) { return 'translate(' + source.y + ',' + source.x + ')'; })
      .remove();
    nodeExit.select('circle')
      .attr('r', 1e-6);
    nodeExit.select('text')
      .style('fill-opacity', 1e-6);
  }

}
