import { Component, Input, Output, EventEmitter, OnInit, SimpleChange } from '@angular/core';

@Component({
  selector: 'list-limiter',
  template: `
  <li>
    <span class="moreChevron" [ngClass]="{'disabled' : !isMore}">
      <a (click)=showMore() data-toggle="tooltip" [title]="tooltip">
        <i class="fa fa-angle-double-down fa-2x"  aria-hidden="true"></i>
      </a>
    </span>
  </li>
  `,
  styleUrls: ['list-limiter.component.css']
})
export class ListLimiterComponent {
  @Input() listCount: number;
  @Input() numToDisplay: number;
  @Input() displayIncrement = 4;
  @Input() tooltip = 'Show more';
  @Output() numDisplayed = new EventEmitter();

  get isMore() {
    return this.numToDisplay < this.listCount;
  }

  showMore() {
    this.numToDisplay += this.displayIncrement;
    this.numDisplayed.emit(this.numToDisplay);
  }
}
