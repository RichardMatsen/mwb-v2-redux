import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksComponent } from './tasks.component';
import { KanbanComponent } from './kanban/kanban.component';
import { KanbanListComponent } from './kanban-list/kanban-list.component';
import { KanbanCardComponent } from './kanban-card/kanban-card.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
  ],
  declarations: [
    TasksComponent,
    KanbanComponent,
    KanbanListComponent,
    KanbanCardComponent
  ],
  providers: [
  ],
})
export class TasksModule {}
