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
    this.lists = [
      {
        name: 'Unassigned',
        cards: [
          {
            id: 1,
            status: 'Unassigned',
            description: 'validations',
            effectiveDate: '2017-06-07',
          },
        ]
      },
      {
        name: 'In Progress',
        cards: [
          {
            id: 2,
            status: 'In Progress',
            description: 'validations',
            icon: 'fa-check-square-o',
            effectiveDate: '2017-06-06',
            assignedTo: 'Sam'
          },
        ]
      },
      {
        name: 'Waiting',
        cards: []
      },
      {
        name: 'Done',
        cards: []
      }
    ]
  }

}
