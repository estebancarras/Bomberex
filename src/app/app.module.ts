import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: "AIzaSyDK-yZF6KkVpTDIHLmnQUnDZUS-1-x8gy8",
  authDomain: "bomberex-70bb0.firebaseapp.com",
  projectId: "bomberex-70bb0",
  storageBucket: "bomberex-70bb0.firebasestorage.app",
  messagingSenderId: "409061707467",
  appId: "1:409061707467:web:441385fd843ed07ee4154e",
  measurementId: "G-Q0Y8NH1CXK"
};

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],
  exports: [
    CommonModule,
    IonicModule,
    RouterModule,
  ]
})
export class AppModule {}
