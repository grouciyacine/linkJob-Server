// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUyaAkmvzybUAEW1YpcnaKZMhVmAyE81E",
  authDomain: "jobsearch-4a7e4.firebaseapp.com",
  projectId: "jobsearch-4a7e4",
  storageBucket: "jobsearch-4a7e4.appspot.com",
  messagingSenderId: "893641769640",
  appId: "1:893641769640:web:d66e3f80daa5a258e6f89d",
  measurementId: "G-4M16WNT700"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);