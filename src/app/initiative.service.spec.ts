import { TestBed, inject } from '@angular/core/testing';

import { InitiativeService } from './initiative.service';

describe('InitiativeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InitiativeService]
    });
  });

  it('should be created', inject([InitiativeService], (service: InitiativeService) => {
    expect(service).toBeTruthy();
  }));
});
