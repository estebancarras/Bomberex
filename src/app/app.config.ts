import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDK-yZF6KkVpTDIHLmnQUnDZUS-1-x8gy8",
  authDomain: "bomberex-70bb0.firebaseapp.com",
  projectId: "bomberex-70bb0",
  storageBucket: "bomberex-70bb0.firebasestorage.app",
  messagingSenderId: "409061707467",
  appId: "1:409061707467:web:441385fd843ed07ee4154e",
  measurementId: "G-Q0Y8NH1CXK"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()) // ¡Sí, solo uno!
  ]
};
