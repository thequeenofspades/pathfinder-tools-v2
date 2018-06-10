import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellLevelComponent } from './spell-level.component';

describe('SpellLevelComponent', () => {
  let component: SpellLevelComponent;
  let fixture: ComponentFixture<SpellLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpellLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpellLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
