import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoSessionComponent } from './no-session.component';

describe('NoSessionComponent', () => {
  let component: NoSessionComponent;
  let fixture: ComponentFixture<NoSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
