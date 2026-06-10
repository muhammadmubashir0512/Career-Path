// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB89m90-Jyx0r7Sm12U2-mzveG2kO2OxP4",
  authDomain: "career-path-d0e05.firebaseapp.com",
  projectId: "career-path-d0e05",
  storageBucket: "career-path-d0e05.firebasestorage.app",
  messagingSenderId: "335382915772",
  appId: "1:335382915772:web:7da479f7413df258537eb9",
  measurementId: "G-LCHEYSBPSB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);