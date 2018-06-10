import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveSpellListComponent } from './interactive-spell-list.component';

describe('InteractiveSpellListComponent', () => {
  let component: InteractiveSpellListComponent;
  let fixture: ComponentFixture<InteractiveSpellListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractiveSpellListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractiveSpellListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
