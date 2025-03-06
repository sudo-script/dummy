import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBP2X7a91J6UCAVneZs_-bXTEBpfjCCq1Y",
  authDomain: "dummy-9c224.firebaseapp.com",
  projectId: "dummy-9c224",
  storageBucket: "dummy-9c224.firebasestorage.app",
  messagingSenderId: "232252176287",
  appId: "1:232252176287:web:1a40b61ab3854905a42faa",
  databaseURL: "https://dummy-9c224-default-rtdb.firebaseio.com/", // Add your Realtime Database URL
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);