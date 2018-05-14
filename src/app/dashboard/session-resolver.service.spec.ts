import { TestBed, inject } from '@angular/core/testing';

import { SessionResolverService } from './session-resolver.service';

describe('SessionResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionResolverService]
    });
  });

  it('should be created', inject([SessionResolverService], (service: SessionResolverService) => {
    expect(service).toBeTruthy();
  }));
});
