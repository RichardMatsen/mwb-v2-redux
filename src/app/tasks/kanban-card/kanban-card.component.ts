import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { KanbanCard } from '../model/kanban-card';
import { dateformat } from '../../common/mw.common.module';

@Component({
  selector: 'mwb-kanban-card',
  template: `
    <p class="card mwb-kanban-card drag-item" draggable="true" (dragstart)="dragStart($event)" id="{{card?.id}}" >{{cardTitle()}}</p>
  `,
  styles: [`
    p {
      background: white;
      margin: 0 0 6px 0;
      padding: 6px 6px 2px 8px;
    }
  `]
})
export class KanbanCardComponent implements OnInit {

  @Input() card: KanbanCard;

  constructor() { }

  ngOnInit() {
  }

  cardTitle(card) {
    const effectiveDate = typeof this.card.effectiveDate === 'string' ? new Date(this.card.effectiveDate) : this.card.effectiveDate;
    const assignee = this.card.assignedTo ? `[${this.card.assignedTo}]` : '';
    return this.card ? `${this.card.description} ${dateformat(effectiveDate, 'dd mmm')} ${assignee}`.trim() : '';
  }

  dragStart(ev) {
    ev.dataTransfer.setData('text', ev.target.id);
  }

}
