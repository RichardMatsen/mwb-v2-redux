import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { referentialsGraphModel as graph } from '../referentials-graph.model';
import { ReferentialsGraphDrawService } from './referentials-graph.draw.service';

@Injectable()
export class ReferentialsGraphToggleService {

  constructor(
    private drawService: ReferentialsGraphDrawService,
  ) { }

  public nodeClick = (node) => {
    if (node.depth === 0) {
      graph.links.showPathText = false;
      this.hideAll(node);
      this.drawService.draw(node);
      this.showAll(node);
      this.drawService.draw(node);
      return;
    }
    if (node.depth === 1) {
      graph.links.showPathText = true;
      this.closeSiblings(node);
      this.showAll(node);
      this.drawService.draw(node);
      return;
    }
  }

  private toggleChildren(parent) {
    let anyOpen = false;
    parent.children.forEach((child) => {
      if (child.children) {
        anyOpen = true;
      }
    });
    if (anyOpen) {
      parent.children.forEach((child) => {
        this.hideAll(child);
      });
    } else {
      this.showAll(parent);
    }
  }

  hide(d) {  // Remove children array but save content
    if (!d.children) { return; };
    d._children = d.children;
    d.children = null;
  }

  show(d) {  // Restore children array
    if (!d._children) { return; };
    d.children = d._children;
    d._children = null;
  }

  hideAll(d) {
    (d.children || d._children || []).forEach((c) => {
      this.hideAll(c);
    });
    this.hide(d);
  }

  showAll(d) {
    (d.children || d._children || []).forEach((c) => {
      this.showAll(c);
    });
    this.show(d);
  }

  toggleAll(d) {
    (d.children || d._children || []).forEach(function (c) {
      this.toggleAll(c);
    });
    this.toggle(d);
  }

  toggle(d) {
    if (d.children)  {
      this.hide(d);
    } else {
      if (d._children) {
        this.show(d);
      }
    }
  }

  closeSiblings(current) {
    current.parent.children.forEach((sibling) => {
      if (sibling !== current) {
        this.hide(sibling);
      }
    });
  }

  closeChildren(parent) {
    parent.children.forEach((child) => {
      this.hide(child);
    });
  }

}
