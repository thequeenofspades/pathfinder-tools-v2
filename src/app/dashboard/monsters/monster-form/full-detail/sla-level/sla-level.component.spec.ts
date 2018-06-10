import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaLevelComponent } from './sla-level.component';

describe('SlaLevelComponent', () => {
  let component: SlaLevelComponent;
  let fixture: ComponentFixture<SlaLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlaLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
