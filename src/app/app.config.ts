import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({ "projectId": "angular-firebase-f0fb4", "appId": "1:494106049204:web:deb5082e0bc0a8ca4a35e1", "storageBucket": "angular-firebase-f0fb4.appspot.com", "apiKey": "AIzaSyCWwYwSXlViHfh8Zx6pxkWq36IpDaRCG8k", "authDomain": "angular-firebase-f0fb4.firebaseapp.com", "messagingSenderId": "494106049204" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};

