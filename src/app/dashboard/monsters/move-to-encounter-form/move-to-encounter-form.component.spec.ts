import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveToEncounterFormComponent } from './move-to-encounter-form.component';

describe('MoveToEncounterFormComponent', () => {
  let component: MoveToEncounterFormComponent;
  let fixture: ComponentFixture<MoveToEncounterFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveToEncounterFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveToEncounterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
