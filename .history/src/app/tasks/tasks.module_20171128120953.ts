import { NgModule } from '@angular/core';
import { KanbanComponent } from './kanban/kanban.component';
import { KanbanListComponent } from './kanban-list/kanban-list.component';
import { KanbanCardComponent } from './kanban-card/kanban-card.component';

@NgModule({
  imports: [
  ],
  exports: [
  ],
  declarations: [
    KanbanComponent,
    KanbanListComponent,
    KanbanCardComponent
  ],
  providers: [
  ],
})
export class TasksModule {}
