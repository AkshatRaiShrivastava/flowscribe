import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBtkjbIAnCVY9Lx3qA0EwOSXwOFoywndpw",
  authDomain: "flowscribe-14939.firebaseapp.com",
  projectId: "flowscribe-14939",
  storageBucket: "flowscribe-14939.firebasestorage.app",
  messagingSenderId: "263241481693",
  appId: "1:263241481693:web:4e18e2e0275fc0069f0a34",
  measurementId: "G-GYT3896YFE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code == 'unimplemented') {
    console.warn('The current browser doesn\'t support persistence.');
  }
});
