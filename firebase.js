// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFQmKzzSrxwzXJ9Kh7JEiVTY1Wg-gXPK4",
  authDomain: "simple-firebase-app-d8a6f.firebaseapp.com",
  projectId: "simple-firebase-app",
  storageBucket: "simple-firebase-app.appspot.com",
  messagingSenderId: "964124765175",
  appId: "1:964124765175:web:62934df126e52bc150dcf2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export firestore database
// It will be imported into your react app whenever it is needed
export const db = getFirestore(app);
