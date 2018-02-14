import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksModule } from '../tasks.module';
import { KanbanCardComponent } from './kanban-card.component';

describe('KanbanCardComponent', () => {
  let component: KanbanCardComponent;
  let fixture: ComponentFixture<KanbanCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TasksModule ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });
});
