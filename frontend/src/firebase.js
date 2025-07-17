import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCS2Bm86iXkac7cFMSLKz1Ds4hAblHziAE",
  authDomain: "chat-app-37e43.firebaseapp.com",
  projectId: "chat-app-37e43",
  storageBucket: "chat-app-37e43.firebasestorage.app",
  messagingSenderId: "841825784600",
  appId: "1:841825784600:web:9f179a198bc35ce2d8046d",
  measurementId: "G-5D491RPYW1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 