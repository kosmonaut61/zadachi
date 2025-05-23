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

console.log("[Firebase] Starting initialization");

// Initialize Firebase only if it hasn't been initialized already
let app: FirebaseApp;
try {
  if (getApps().length === 0) {
    console.log("[Firebase] No existing apps, initializing new app");
    app = initializeApp(firebaseConfig);
  } else {
    console.log("[Firebase] Using existing app instance");
    app = getApps()[0];
  }
} catch (error) {
  console.error("[Firebase] Error initializing Firebase:", error);
  throw error;
}

// Initialize services
let analytics = null;
if (typeof window !== 'undefined') {
  console.log("[Firebase] Checking analytics support");
  isSupported().then(yes => {
    if (yes) {
      console.log("[Firebase] Analytics supported, initializing");
      analytics = getAnalytics(app);
    } else {
      console.log("[Firebase] Analytics not supported");
    }
  });
}

console.log("[Firebase] Initializing auth and Firestore");
const auth = getAuth(app);
const db = getFirestore(app);

// Enable offline persistence and handle connection issues
if (typeof window !== 'undefined') {
  console.log("[Firebase] Setting up offline persistence");
  // Enable offline persistence
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('[Firebase] Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('[Firebase] The current browser does not support persistence.');
    } else {
      console.error('[Firebase] Error enabling persistence:', err);
    }
  });

  // Enable network connection
  console.log("[Firebase] Enabling network connection");
  enableNetwork(db).catch((err: Error) => {
    console.error("[Firebase] Error enabling network:", err);
  });
}

// Initialize Google Auth Provider with OAuth configuration
console.log("[Firebase] Setting up Google Auth Provider");
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Add scopes if needed
googleProvider.addScope('profile');
googleProvider.addScope('email');

console.log("[Firebase] Initialization complete");

export { app, analytics, auth, db, googleProvider }; 