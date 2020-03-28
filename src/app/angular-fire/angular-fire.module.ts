import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

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
