import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveConditionListComponent } from './interactive-condition-list.component';

describe('InteractiveConditionListComponent', () => {
  let component: InteractiveConditionListComponent;
  let fixture: ComponentFixture<InteractiveConditionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractiveConditionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractiveConditionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
