import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { env } from '@/config';

const firebaseConfig = {
  apiKey: env.FIREBASE.API_KEY,
  authDomain: env.FIREBASE.AUTH_DOMAIN,
  projectId: env.FIREBASE.PROJECT_ID,
  storageBucket: env.FIREBASE.STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE.MESSAGING_SENDER_ID,
  appId: env.FIREBASE.APP_ID
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut };
