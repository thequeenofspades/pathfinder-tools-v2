import { PlayerViewModule } from './player-view.module';

describe('PlayerViewModule', () => {
  let playerViewModule: PlayerViewModule;

  beforeEach(() => {
    playerViewModule = new PlayerViewModule();
  });

  it('should create an instance', () => {
    expect(playerViewModule).toBeTruthy();
  });
});
