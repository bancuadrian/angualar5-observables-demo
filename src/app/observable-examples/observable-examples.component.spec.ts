import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservableExamplesComponent } from './observable-examples.component';

describe('ObservableExamplesComponent', () => {
  let component: ObservableExamplesComponent;
  let fixture: ComponentFixture<ObservableExamplesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservableExamplesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservableExamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
