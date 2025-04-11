// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtqBm8nu3EY-xoucuNW64aMbxPrD3S9Cc",
  authDomain: "fitnessbuddy-99da7.firebaseapp.com",
  projectId: "fitnessbuddy-99da7",
  storageBucket: "fitnessbuddy-99da7.firebasestorage.app",
  messagingSenderId: "523170437067",
  appId: "1:523170437067:web:39d440df6deefaca57084e",
  measurementId: "G-L8H78QE5P6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);