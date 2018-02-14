import { Component, OnInit, Input } from '@angular/core';
import { KanbanCard } from '../model/kanban-card';

@Component({
  selector: 'mwb-kanban-card',
  templateUrl: './kanban-card.component.html',
  styleUrls: ['./kanban-card.component.css']
})
export class KanbanCardComponent implements OnInit {

  @Input() card: KanbanCard;

  constructor() { }

  ngOnInit() {
  }

  dragStart(ev) {
    ev.dataTransfer.setData('text', ev.target.id);
  }

}
