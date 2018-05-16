import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerViewOptionsComponent } from './player-view-options.component';

describe('PlayerViewOptionsComponent', () => {
  let component: PlayerViewOptionsComponent;
  let fixture: ComponentFixture<PlayerViewOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerViewOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerViewOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
