import { Component, OnInit } from '@angular/core';
import { KanbanListComponent } from '../kanban-list/kanban-list.component';
import { KanbanList } from '../model/kanban-list';

@Component({
  selector: 'mwb-kanban',
  template: `
    <div>
      <mwb-kanban-list *ngFor="let list of lists" [list]="list"></mwb-kanban-list>
    </div>
  `,
})
export class KanbanComponent implements OnInit {

  lists: KanbanList[];

  constructor() { }

  ngOnInit() {
  }

}
