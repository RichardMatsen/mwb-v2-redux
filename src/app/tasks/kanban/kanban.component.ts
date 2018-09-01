import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { KanbanListComponent } from '../kanban-list/kanban-list.component';
import { KanbanList } from '../model/kanban-list';
import { waitFor$ } from 'app/store/selector-helpers/selector-helpers';

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

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('data/kanban/kanban.json').take(1)
      .subscribe((res: any) => this.lists = res.lists);
  }
}
