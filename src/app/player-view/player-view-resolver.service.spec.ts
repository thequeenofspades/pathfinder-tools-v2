import { TestBed, inject } from '@angular/core/testing';

import { PlayerViewResolverService } from './player-view-resolver.service';

describe('PlayerViewResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlayerViewResolverService]
    });
  });

  it('should be created', inject([PlayerViewResolverService], (service: PlayerViewResolverService) => {
    expect(service).toBeTruthy();
  }));
});
