import { Component, OnInit, AfterViewInit, ChangeDetectorRef, NgZone } from '@angular/core';
import * as d3 from 'd3';
import { referentialsGraphModel as graph } from './referentials-graph.model';
import { ReferentialsGraphDataService } from './services/referentials-graph.data.service';
import { ReferentialsGraphDrawService } from './services/referentials-graph.draw.service';
import { ReferentialsGraphDrawNodesService } from './services/referentials-graph.draw.nodes.service';
import { ReferentialsGraphDrawLinksService } from './services/referentials-graph.draw.links.service';
import { ReferentialsGraphToggleService } from './services/referentials-graph.toggle.service';

@Component({
  selector: 'mwb-referentials-graph',
  templateUrl: './referentials-graph.component.html',
  styleUrls: ['./referentials-graph.component.css'],
  providers: [
    ReferentialsGraphDataService,
    ReferentialsGraphDrawService,
    ReferentialsGraphDrawNodesService,
    ReferentialsGraphDrawLinksService,
    ReferentialsGraphToggleService,
  ]
})
export class ReferentialsGraphComponent implements OnInit {

  constructor(
    private dataService: ReferentialsGraphDataService,
    private drawService: ReferentialsGraphDrawService,
    private toggleService: ReferentialsGraphToggleService,
    private changeRef: ChangeDetectorRef,
    private ngZone: NgZone,
  ) { }

  ngOnInit() {
    this.changeRef.detach();
  }

  public setup() {
    this.initGraphModel();
    this.dataService.loadData()
      .subscribe((data) => {
        graph.treeData = data;
        this.nodifyData(data);
        this.positionNodes();
        this.drawService.draw(graph.rootNode);
      });
  }

  private initGraphModel() {
    graph.innerWidth = graph.width - graph.margins.right - graph.margins.left;
    graph.innerHeight = graph.height - graph.margins.top - graph.margins.bottom;
    graph.nodeClick = this.toggleService.nodeClick;
    graph.duration = d3.event && d3.event.altKey ? 5000 : 500;
    graph.diagonal = this.diagonal;
    this.initSvgInTemplate();
    this.initTreeMap();
  }

  private initSvgInTemplate() {
    graph.svg = d3.select('.d3-graph')
      .append('svg')
      .attr('width', graph.width)
      .attr('height', graph.height)
      .append('g')
      .attr('transform', 'translate(' + graph.margins.bottom + ',' + graph.margins.top + ')');
  }

  private initTreeMap() {
    graph.treeMap = d3.tree()
      .size([graph.innerHeight, graph.innerWidth]);
  }

  private nodifyData(data) {
    graph.rootNode = d3.hierarchy(data);
    graph.rootNode.x0 = (graph.innerHeight / 2) + graph.margins.bottom;
    graph.rootNode.y0 = graph.yOffset;
  }

  private positionNodes() {
    graph.treeMap(graph.rootNode);
    graph.rootNode.x0 = graph.innerHeight / 2;
    graph.rootNode.y0 = 0;
  }

  private diagonal(source, target) {
    // Creates a curved (diagonal) path from parent to the child nodes
    const path = `M ${source.y} ${source.x}
            C ${(source.y + target.y) / 2} ${source.x},
              ${(source.y + target.y) / 2} ${target.x},
              ${target.y} ${target.x}`;
    return path;
  }

}
