import { Component, ViewChild } from '@angular/core';
import { ModalDirective, ModalModule } from 'ngx-bootstrap';
import { ReferentialsGraphComponent } from 'app/graphs/referentials-graph/referentials-graph.component';
import { SharedDataService } from 'app/services/shared-data.service';

@Component({
  selector: 'mwb-referentials-diagram-modal',
  template: `
    <div bsModal #modal="bs-modal" class="modal fade"
         tabindex="-1" role="dialog"
         aria-labelledby="myLargeModalLabel" aria-hidden="true"
         (onHidden)="hide()">
      <div class="modal-dialog">
        <div class="modal-content referentials-graph">
          <div class="modal-header">
            <h4 class="modal-title pull-left">Entity Relationship Diagram</h4>
            <button type="button" class="close pull-right" (click)="hide()" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <mwb-referentials-graph #graph></mwb-referentials-graph>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ['div.modal-dialog { width: 1100px; }']
})
// tslint:disable-next-line:component-class-suffix
export class ReferentialsDiagramModal {
  @ViewChild('modal') modal: ModalDirective;
  @ViewChild('graph') graph: ReferentialsGraphComponent;

  constructor(
    private sharedDataService: SharedDataService,
  ) {}

  show() {
    this.graph.setup();
    this.modal.show();
  }

  hide() {
    this.modal.hide();
    this.sharedDataService.changePrompt('Referentials Diagram');
  }
}
