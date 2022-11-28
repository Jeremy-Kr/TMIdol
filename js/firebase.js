import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyADD4ZA1q0X15P3vw6q_J-gDDkg3mfW3dI',
  authDomain: 'prec-tmi.firebaseapp.com',
  projectId: 'prec-tmi',
  storageBucket: 'prec-tmi.appspot.com',
  messagingSenderId: '411349715546',
  appId: '1:411349715546:web:a5ecb1ce925982f0c8a663',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const authService = getAuth(app);
const dbService = getFirestore(app);
const storageService = getStorage(app);

export { app, authService, dbService, storageService };
