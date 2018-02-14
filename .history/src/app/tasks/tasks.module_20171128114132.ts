import { NgModule } from '@angular/core';

import { FileService } from './file-service/file.service';
import { DataService } from './data-service/data.service';
import { FormatService } from './data-service/format.service';
import { NameParsingService } from './data-service/name-parsing.service';
import { ListFormatterService } from './list-formatter.service/list-formatter.service';
import { InMemUsersService } from './in-memory-db/in-memory-db';
import { KanbanListComponent } from './kanban-list/kanban-list.component';

@NgModule({
  imports: [
  ],
  exports: [
  ],
  declarations: [
  KanbanListComponent],
  providers: [
    NameParsingService,
    FileService,
    ListFormatterService,
  ],
})
export class ServicesModule {}
