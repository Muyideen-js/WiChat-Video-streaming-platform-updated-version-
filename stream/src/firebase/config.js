// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2B0db6rxiRCXcRmZ5tMUsgTxmsT-tvVo",
  authDomain: "work-a7d3b.firebaseapp.com",
  projectId: "work-a7d3b",
  storageBucket: "work-a7d3b.firebasestorage.app",
  messagingSenderId: "749184693009",
  appId: "1:749184693009:web:0162e3fb5d4fa7db85d2b0",
  measurementId: "G-WCV0QC1KPK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Analytics (only in browser environment)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;

