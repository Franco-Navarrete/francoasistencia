// firebase.js
// Módulo de inicialización Firebase - importa desde tus HTML con: import { db, auth } from './firebase.js'
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

// Reemplaza por tu configuración (ya está la que usaste)
const firebaseConfig = {
  apiKey: "AIzaSyC33xct8HUvUYHiKayDFaxFzn4cYrswE7U",
  authDomain: "ingreso-y-egreso-b1db2.firebaseapp.com",
  projectId: "ingreso-y-egreso-b1db2",
  storageBucket: "ingreso-y-egreso-b1db2.firebasestorage.app",
  messagingSenderId: "193807042960",
  appId: "1:193807042960:web:4b1d867f86af8a9bf98b15",
  measurementId: "G-HMR0LZBWWP"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
