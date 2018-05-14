import { PlayerViewRoutingModule } from './player-view-routing.module';

describe('PlayerViewRoutingModule', () => {
  let playerViewRoutingModule: PlayerViewRoutingModule;

  beforeEach(() => {
    playerViewRoutingModule = new PlayerViewRoutingModule();
  });

  it('should create an instance', () => {
    expect(playerViewRoutingModule).toBeTruthy();
  });
});
