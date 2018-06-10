import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonsterPreviewComponent } from './monster-preview.component';

describe('MonsterPreviewComponent', () => {
  let component: MonsterPreviewComponent;
  let fixture: ComponentFixture<MonsterPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonsterPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonsterPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
