import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveSlaListComponent } from './interactive-sla-list.component';

describe('InteractiveSlaListComponent', () => {
  let component: InteractiveSlaListComponent;
  let fixture: ComponentFixture<InteractiveSlaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractiveSlaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractiveSlaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
