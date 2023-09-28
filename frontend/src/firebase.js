// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, storageBucket } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4XrSQsU-Nhtb77EPciOj31fJn826OFIQ",
  authDomain: "digital-moodboard.firebaseapp.com",
  projectId: "digital-moodboard",
  storageBucket: "digital-moodboard.appspot.com",
  messagingSenderId: "794295834694",
  appId: "1:794295834694:web:54cd95efdbcfb8da191247",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
export default app;
