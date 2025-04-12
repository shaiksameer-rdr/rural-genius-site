// Firebase initialization and configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBDuaUhDfEpTUcKOxk4jekskj_iyveEHUg",
    authDomain: "rural-genius.firebaseapp.com",
    projectId: "rural-genius",
    storageBucket: "rural-genius.firebasestorage.app",
    messagingSenderId: "1046040928951",
    appId: "1:1046040928951:web:b09562f61b00b51f0ba332",
    measurementId: "G-W1YL8P78Y3"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Export initialized services
export { app, auth, db, analytics };