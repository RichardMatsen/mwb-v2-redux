import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksModule } from '../tasks.module';
import { KanbanListComponent } from './kanban-list.component';

/*
  @playground as a temporary workaround you can run tests with --sourcemaps=false to see the actual error message 
  but lets keep this issue more generic, this issue occurs with any runtime error, as per the example. 
  Your service/function may not be returning what you expect, you'll see a better message with sourcemaps off.
*/

describe('KanbanListComponent', () => {
  let component: KanbanListComponent;
  let fixture: ComponentFixture<KanbanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TasksModule ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });
});
