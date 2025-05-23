import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then(yes => yes && (analytics = getAnalytics(app)));
}

const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Google Auth Provider with OAuth configuration
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
  // Add your OAuth client ID if you have one
  // client_id: 'your-client-id.apps.googleusercontent.com'
});

// Add scopes if needed
googleProvider.addScope('profile');
googleProvider.addScope('email');

export { app, analytics, auth, db, googleProvider }; 