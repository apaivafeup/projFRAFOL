// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmhyafRjRrYA0wBaANwzZrFKpS_0M9Njk",
  authDomain: "projfrafol.firebaseapp.com",
  projectId: "projfrafol",
  storageBucket: "projfrafol.firebasestorage.app",
  messagingSenderId: "812908717741",
  appId: "1:812908717741:web:3d6b7a41841a430131c824",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
