import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "",
  authDomain: "giftnow-227f6.firebaseapp.com",
  projectId: "giftnow-227f6",
  storageBucket: "giftnow-227f6.firebasestorage.app",
  messagingSenderId: "134023030440",
  appId: "1:134023030440:web:97af4bc7fff5f6ebe6049d"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);

export default app;

