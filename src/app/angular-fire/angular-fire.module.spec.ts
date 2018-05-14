import { AngularFireModule } from './angular-fire.module';

describe('AngularFireModule', () => {
  let angularFireModule: AngularFireModule;

  beforeEach(() => {
    angularFireModule = new AngularFireModule();
  });

  it('should create an instance', () => {
    expect(angularFireModule).toBeTruthy();
  });
});
