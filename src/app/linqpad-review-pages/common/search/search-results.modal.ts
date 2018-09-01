import { Component, Input, ViewChild, } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'search-results-modal',
  template: `
    <div bsModal #searchResultsModal="bs-modal" class="modal modal-container fade" tabindex="-1"
         role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title pull-left">Results for search term '{{searchTerm}}'</h4>
            <button type="button" class="close pull-right" (click)="searchResultsModal.hide()" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="list-group">
              <a class="list-group-item pointable" *ngFor="let result of results">{{result}}</a>
            </div>
          </div>
        </div>
      </div>
    </div>`
})
export class SearchResultsModalComponent {
  @Input() visible;
  @Input() searchTerm;
  @Input() results;
  @ViewChild('searchResultsModal') searchResultsModal: ModalDirective;

  show() {
    this.searchResultsModal.show();
  }

  hide() {
    this.searchResultsModal.hide();
  }
}
