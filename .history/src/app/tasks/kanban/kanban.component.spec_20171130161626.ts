import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksModule } from '../tasks.module';
import { KanbanComponent } from './kanban.component';
// import { KanbanListComponent } from '../kanban-list/kanban-list.component';
// import { KanbanCardComponent } from '../kanban-card/kanban-card.component';

describe('KanbanComponent', () => {
  let component: KanbanComponent;
  let fixture: ComponentFixture<KanbanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TasksModule ],
      declarations: [ 
        KanbanComponent, 
        // KanbanListComponent,
        // KanbanCardComponent 
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
