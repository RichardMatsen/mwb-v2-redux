import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { TasksModule } from '../tasks.module';
import { KanbanCardComponent } from './kanban-card.component';
// import { KanbanCard } from '../model/kanban-card';

describe('KanbanCardComponent', () => {
  let component: KanbanCardComponent;
  let fixture: ComponentFixture<KanbanCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      // imports: [ TasksModule ],
      declarations: [ KanbanCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
