/*
Ref: https://bl.ocks.org/d3noob/5537fe63086c4f100114f87f124850dd
     https://bl.ocks.org/d3noob/08ecb6ea9bb68ba0d9a7e89f344acec8
     https://www.pshrmn.com/tutorials/d3/layouts/#tree
*/
import { Injectable } from '@angular/core';
import { referentialsGraphModel as graph } from '../referentials-graph.model';
import { ReferentialsGraphDrawNodesService } from './referentials-graph.draw.nodes.service';
import { ReferentialsGraphDrawLinksService } from './referentials-graph.draw.links.service';

@Injectable()
export class ReferentialsGraphDrawService {

  constructor(
    private drawNodesService: ReferentialsGraphDrawNodesService,
    private drawLinksService: ReferentialsGraphDrawLinksService,
  ) { }

  public draw(source) {
    const nodes = this.drawNodesService.drawNodes(source);
    const links = this.drawLinksService.drawLinks(source);
    this.saveOldPositions(nodes);
  }

  private saveOldPositions(nodes) {
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }
}
