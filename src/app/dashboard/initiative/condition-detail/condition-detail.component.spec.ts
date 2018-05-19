import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionDetailComponent } from './condition-detail.component';

describe('ConditionDetailComponent', () => {
  let component: ConditionDetailComponent;
  let fixture: ComponentFixture<ConditionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
