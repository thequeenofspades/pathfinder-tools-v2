import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuffViewComponent } from './buff-view.component';

describe('BuffViewComponent', () => {
  let component: BuffViewComponent;
  let fixture: ComponentFixture<BuffViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuffViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuffViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
