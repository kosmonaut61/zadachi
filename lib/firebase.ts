import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db }; 