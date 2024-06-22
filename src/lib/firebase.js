import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-39573.firebaseapp.com",
  projectId: "reactchat-39573",
  storageBucket: "reactchat-39573.appspot.com",
  messagingSenderId: "974583137435",
  appId: "1:974583137435:web:fa72a869e3e2c665c0723e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()