// Import Firebase SDK functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCoZr41TUJQ5SFujnZmabz7MsKUMw_vzNk",
  authDomain: "e-commerce-chatbot-ec4f8.firebaseapp.com",
  projectId: "e-commerce-chatbot-ec4f8",
  storageBucket: "e-commerce-chatbot-ec4f8.firebasestorage.app",
  messagingSenderId: "520822581340",
  appId: "1:520822581340:web:0e687d9459b1b66d4ade99",
  measurementId: "G-ND8DH433TG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
