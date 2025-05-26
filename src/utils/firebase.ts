import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
     apiKey: "AIzaSyAgf1scxtN7n50GDhZxTGF5kdQw5VD_ZBg",
     authDomain: "expenses-e127a.firebaseapp.com",
     databaseURL: "https://expenses-e127a-default-rtdb.firebaseio.com",
     projectId: "expenses-e127a",
     storageBucket: "expenses-e127a.firebasestorage.app",
     messagingSenderId: "1037820150471",
     appId: "1:1037820150471:web:7df33d5f58ee12770db4e2",
     measurementId: "G-BRT2HQLL7X"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();