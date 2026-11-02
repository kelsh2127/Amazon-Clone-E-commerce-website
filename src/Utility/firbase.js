import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
import "firebase/compat/firestore";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCZlorXb1AxFryfoPXTD0K1aUYhVy-ddO8",
  authDomain: "clone-8e87a.firebaseapp.com",
  projectId: "clone-8e87a",
  storageBucket: "clone-8e87a.firebasestorage.app",
  messagingSenderId: "285946207756",
  appId: "1:285946207756:web:91e679e8ec97d3d3cc9829"
};

// Initialize Firebase - fix: use firebase.initializeApp instead of initializeApp
const app = firebase.initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = app.firestore(); // This works with compat version