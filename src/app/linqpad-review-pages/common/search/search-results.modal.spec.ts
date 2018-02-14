import { TestBed, async, inject } from '@angular/core/testing';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SearchResultsModalComponent } from './search-results.modal';

describe('SearchResultsModal', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
       ModalModule.forRoot(),
      ],
      declarations: [
        SearchResultsModalComponent,
      ],
      providers: [
        SearchResultsModalComponent
      ],
    }).compileComponents();
  });

  let searchResultsModalComponent, fixture;
  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultsModalComponent);
    searchResultsModalComponent = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(searchResultsModalComponent).toBeDefined();
    expect(searchResultsModalComponent.searchResultsModal).toBeDefined();
  });


  it('should show', () => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      searchResultsModalComponent.show();
    });
  });

  it('should hide', () => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      searchResultsModalComponent.hide();
    });
  });

});
