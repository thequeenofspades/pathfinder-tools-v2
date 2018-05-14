import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncounterFormComponent } from './encounter-form.component';

describe('EncounterFormComponent', () => {
  let component: EncounterFormComponent;
  let fixture: ComponentFixture<EncounterFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncounterFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncounterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
