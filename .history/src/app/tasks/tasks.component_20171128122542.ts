import { Component, OnInit } from '@angular/core';
import { KanbanComponent } from './kanban/kanban.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
