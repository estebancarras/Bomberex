import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { initializeApp } from 'firebase/app';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { addIcons } from 'ionicons';
import { homeOutline, carSportOutline, personCircleOutline, mailOutline, buildOutline, logOutOutline, starOutline, keyOutline, shieldCheckmarkOutline, lockClosedOutline, settingsOutline } from 'ionicons/icons';

addIcons({
  'home-outline': homeOutline,
  'car-sport-outline': carSportOutline,
  'person-circle-outline': personCircleOutline,
  'mail-outline': mailOutline,
  'build-outline': buildOutline,
  'log-out-outline': logOutOutline,
  'star-outline': starOutline,
  'key-outline': keyOutline,
  'shield-checkmark-outline': shieldCheckmarkOutline,
  'lock-closed-outline': lockClosedOutline,
  'settings-outline': settingsOutline,
});

const firebaseConfig = {
  apiKey: "AIzaSyDK-yZF6KkVpTDIHLmnQUnDZUS-1-x8gy8",
  authDomain: "bomberex-70bb0.firebaseapp.com",
  projectId: "bomberex-70bb0",
  storageBucket: "bomberex-70bb0.firebasestorage.app",
  messagingSenderId: "409061707467",
  appId: "1:409061707467:web:441385fd843ed07ee4154e",
  measurementId: "G-Q0Y8NH1CXK"
};

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],
});
