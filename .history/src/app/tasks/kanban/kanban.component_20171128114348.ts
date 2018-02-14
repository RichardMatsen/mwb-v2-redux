import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mwb-kanban',
  template: `
    <div>
      <mwb-kanban-list *ngFor="let list of lists" [list]="list" [cardStore]="cardStore"></mwb-kanban--list>
    </div>
  `,
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
