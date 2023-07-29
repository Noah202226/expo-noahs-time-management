import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBH3UYFNBJd5h2fM8RxjiP9KnFc_DA1e4k",
  authDomain: "next-crud-41141.firebaseapp.com",
  projectId: "next-crud-41141",
  storageBucket: "next-crud-41141.appspot.com",
  messagingSenderId: "743775066250",
  appId: "1:743775066250:web:83ad498587b3f6049a3573",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
