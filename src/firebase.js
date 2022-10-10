// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAuZEZ1V-zQFW6LX4tyJh0xbnkIQ0HGyig",
  authDomain: "trello-clone-bad3a.firebaseapp.com",
  projectId: "trello-clone-bad3a",
  storageBucket: "trello-clone-bad3a.appspot.com",
  messagingSenderId: "192953590938",
  appId: "1:192953590938:web:bf3d66125612628179ab23",
  measurementId: "G-X1KYK8YLLT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export {db}