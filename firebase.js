// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA7EjqDztfItyCRWGJ-mrvAQ0UqNhCoBi8",
  authDomain: "acadhelper-2f618.firebaseapp.com",
  projectId: "acadhelper-2f618",
  storageBucket: "acadhelper-2f618.firebasestorage.app",
  messagingSenderId: "974282425954",
  appId: "1:974282425954:web:b751cdc5039c0388fbf33b",
  measurementId: "G-MR0S731ECH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
