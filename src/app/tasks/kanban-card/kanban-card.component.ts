import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { KanbanCard } from '../model/kanban-card';

@Component({
  selector: 'mwb-kanban-card',
  template: `
    <p class="card" draggable="true" (dragstart)="dragStart($event)" id="{{card?.id}}" >
      #{{card?.id}} - {{card?.description}}
    </p>
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

  // @HostBinding('attr.draggable') true;

  constructor() { }

  ngOnInit() {
  }

  dragStart(ev) {
    ev.dataTransfer.setData('text', ev.target.id);
  }

}
