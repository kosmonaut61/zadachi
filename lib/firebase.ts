import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence, connectFirestoreEmulator, enableNetwork } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDHQVcTqdAU3MiZqjNWVm9_0YM-pfGuN_E",
  authDomain: "zadachi-app.firebaseapp.com",
  projectId: "zadachi-app",
  storageBucket: "zadachi-app.firebasestorage.app",
  messagingSenderId: "696748365866",
  appId: "1:696748365866:web:5271966c653472d7180b53",
  measurementId: "G-SF3V8Z44H9"
};

// Initialize Firebase only if it hasn't been initialized already
let app: FirebaseApp;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw error;
}

// Initialize services
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then(yes => yes && (analytics = getAnalytics(app)));
}

const auth = getAuth(app);
const db = getFirestore(app);

// Enable offline persistence and handle connection issues
if (typeof window !== 'undefined') {
  // Enable offline persistence
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support persistence.');
    }
  });

  // Enable network connection
  enableNetwork(db).catch((err: Error) => {
    console.error("Error enabling network:", err);
  });
}

// Initialize Google Auth Provider with OAuth configuration
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Add scopes if needed
googleProvider.addScope('profile');
googleProvider.addScope('email');

export { app, analytics, auth, db, googleProvider }; 