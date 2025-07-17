// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "realestate-12f44.firebaseapp.com",
  projectId: "realestate-12f44",
  storageBucket: "realestate-12f44.firebasestorage.app",
  messagingSenderId: "907205687859",
  appId: "1:907205687859:web:81b0cd65dea3bc1298c146",
  measurementId: "G-M38ZHGJHZC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);