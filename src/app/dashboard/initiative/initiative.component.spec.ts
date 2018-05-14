import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiativeOrderComponent } from './initiative-order.component';

describe('InitiativeOrderComponent', () => {
  let component: InitiativeOrderComponent;
  let fixture: ComponentFixture<InitiativeOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitiativeOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiativeOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
