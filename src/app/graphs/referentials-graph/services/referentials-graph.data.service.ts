import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import { referentialsGraphModel as graph } from '../referentials-graph.model';

@Injectable()
export class ReferentialsGraphDataService {

  constructor(
    private http: Http,
  ) {}

  public loadData(): Observable<any> {
    return this.http.get(graph.pathToData + graph.treeFile)
      .flatMap((resTree: Response) => {
        const tree = resTree.json();
        return this.http.get(graph.pathToData + graph.dataFile)
          .map((resData: Response) => {
            const data = resData.json();
            return this.merge(tree, data);
        });
      })
      .catch(error => this.handleError(error, 'ReferentialsGraphDataService.loadData'));
  }

  private merge(tree, data) {
    data.forEach((d) => {
      const node = this.findByName(d.child, tree);
      if (node) {
        node.orphans = d.orphans;
        node.color = typeof node.orphans !== 'undefined'
          ? node.orphans === 0 ? 'lightgreen' : 'red'
          : node.children ? 'lightsteelblue' : 'white';
      }
    });
    this.cascadeColor(tree);
    return tree;
  }

  private findByName(name, node) {
    if (name === node.name) {
      return node;
    }
    if (!node.children) {
        return false;
    }
    for (let i = 0; i < node.children.length; i++) {
      const result = this.findByName(name, node.children[i]);
      if (result) {
        return result;
      }
    }
    return false;   // The node has not been found and we have no more options
  }

  private cascadeColor(node) {
    if (!node.children) {
      return;
    }
    node.children.forEach((child) => {
      this.cascadeColor(child);
      if (child.color === 'red' || child.color === 'orange') {
        node.color = 'orange';
      };
    });
  }

  private handleError(error: any, method: string, methodArgs = null) {
    const msg = `${this.constructor.name}.${method}: ${error}. Method args: ${JSON.stringify(methodArgs)}`;
    console.error(msg);
    return Observable.throw(error);
  }

}
