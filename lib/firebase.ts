// Standard modular Firebase imports for v9+
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration for Raunak Pandey Classes
const firebaseConfig = {
  apiKey: "AIzaSyCP5OjEFYXCZtbtYt18VH4n4wL0_LZc-9M",
  authDomain: "raunakpandeyclasses.firebaseapp.com",
  projectId: "raunakpandeyclasses",
  storageBucket: "raunakpandeyclasses.firebasestorage.app",
  messagingSenderId: "972329513047",
  appId: "1:972329513047:web:b431ce3182db9409477312",
  measurementId: "G-N5X63CYK98"
};

// Initialize Firebase with the provided configuration
// This function call initializes the Firebase app instance using the config above.
const app = initializeApp(firebaseConfig);

// Initialize and export the Cloud Firestore database instance
// This instance will be used across the application for data storage and retrieval.
export const db = getFirestore(app);