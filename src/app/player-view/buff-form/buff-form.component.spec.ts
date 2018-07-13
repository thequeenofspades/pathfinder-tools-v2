import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuffFormComponent } from './buff-form.component';

describe('BuffFormComponent', () => {
  let component: BuffFormComponent;
  let fixture: ComponentFixture<BuffFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuffFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuffFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
