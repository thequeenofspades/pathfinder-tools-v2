import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';

@NgModule({
  imports: [
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule
  ],
  exports: [
  	AngularFireAuthModule,
  	AngularFirestoreModule,
  	AngularFireStorageModule
  ],
  declarations: []
})
export class AngularFirebaseModule { }
