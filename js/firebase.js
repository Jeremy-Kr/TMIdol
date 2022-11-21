import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAaUf9CaLX6rxXJk2GfizWXdjgbPyJAs4k',
  authDomain: 'tmidol.firebaseapp.com',
  projectId: 'tmidol',
  storageBucket: 'tmidol.appspot.com',
  messagingSenderId: '887608608292',
  appId: '1:887608608292:web:8af3db4fbd137bbdaafab1',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const authService = getAuth(app);
const dbService = getFirestore(app);
const storageService = getStorage(app);

export { app, authService, dbService, storageService };
