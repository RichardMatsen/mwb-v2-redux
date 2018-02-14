import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksModule } from '../tasks.module';
import { KanbanListComponent } from './kanban-list.component';

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
