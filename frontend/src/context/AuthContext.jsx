import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
} from "firebase/auth";
import axios from "axios";

function getRandomName() {
  const adjectives = ['Brave', 'Happy', 'Clever', 'Mighty', 'Swift', 'Lucky', 'Gentle', 'Bold', 'Calm', 'Witty'];
  const animals = ['Tiger', 'Panda', 'Eagle', 'Lion', 'Wolf', 'Fox', 'Bear', 'Hawk', 'Otter', 'Falcon'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return `${adj} ${animal}`;
}

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const register = async (email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(cred.user);
    // Assign or retrieve random display name
    let displayName = cred.user.displayName;
    if (!displayName) {
      const key = `displayName_${cred.user.uid}`;
      displayName = localStorage.getItem(key);
      if (!displayName) {
        displayName = getRandomName();
        localStorage.setItem(key, displayName);
      }
    }
    await axios.post('http://localhost:5000/api/users/sync', {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName,
    });
    return cred.user;
  };

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    // Assign or retrieve random display name
    let displayName = cred.user.displayName;
    if (!displayName) {
      const key = `displayName_${cred.user.uid}`;
      displayName = localStorage.getItem(key);
      if (!displayName) {
        displayName = getRandomName();
        localStorage.setItem(key, displayName);
      }
    }
    await axios.post('http://localhost:5000/api/users/sync', {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName,
    });
    return cred;
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 