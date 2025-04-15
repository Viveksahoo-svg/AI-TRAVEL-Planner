// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3kQVMHqlVGmHlaR8TM67RBbr7qXPQVgY",
  authDomain: "ai-travel-planner-eb6a1.firebaseapp.com",
  projectId: "ai-travel-planner-eb6a1",
  storageBucket: "ai-travel-planner-eb6a1.firebasestorage.app",
  messagingSenderId: "962969849226",
  appId: "1:962969849226:web:0e0446bf66bee346290c73",
  measurementId: "G-7TXMGHS5X8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };