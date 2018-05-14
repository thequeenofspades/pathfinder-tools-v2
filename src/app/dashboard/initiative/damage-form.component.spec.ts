import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageFormComponent } from './damage-form.component';

describe('DamageFormComponent', () => {
  let component: DamageFormComponent;
  let fixture: ComponentFixture<DamageFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamageFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
