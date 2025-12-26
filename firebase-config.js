import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCl1AXMc-pZzL7UjDKyEQmTRHWLHU8FYPc",
  authDomain: "portfolio-website-832ef.firebaseapp.com",
  projectId: "portfolio-website-832ef",
  storageBucket: "portfolio-website-832ef.firebasestorage.app",
  messagingSenderId: "323837672674",
  appId: "1:323837672674:web:b7f3039a76b1212544b2bb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };