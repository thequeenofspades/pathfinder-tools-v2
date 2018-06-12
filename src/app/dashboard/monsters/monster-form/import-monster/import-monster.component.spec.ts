import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportMonsterComponent } from './import-monster.component';

describe('ImportMonsterComponent', () => {
  let component: ImportMonsterComponent;
  let fixture: ComponentFixture<ImportMonsterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportMonsterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportMonsterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
