// firebase.js

import { initializeApp } from 'firebase/app';
import { getDatabase, ref as databaseRef, set, remove, push, get, ref } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAHfTtMp6QIkc8i-UlwcjjpYs6oWzH90NA",
  authDomain: "microfab-admin.firebaseapp.com",
  databaseURL: "https://microfab-admin-default-rtdb.firebaseio.com",
  projectId: "microfab-admin",
  storageBucket: "microfab-admin.appspot.com",
  messagingSenderId: "949509913271",
  appId: "1:949509913271:web:7fba49e66f7a592ce2ab32",
  measurementId: "G-B1KM0RLBQN",
};
  

const app = initializeApp(firebaseConfig);

const database = {
  get: async (path) => get(databaseRef(getDatabase(app), path)),
  set: async (path, data) => set(ref(getDatabase(app), path), data),
  push: async (path, data) => push(ref(getDatabase(app), path), data),
  remove: async (path) => remove(ref(getDatabase(app), path)),
};

const storageFunctions = {
  ref: (path) => storageRef(getStorage(app), path),
  uploadBytes: async (ref, data) => uploadBytes(ref, data),
  getDownloadURL: async (ref) => getDownloadURL(ref),
};

export { app, database, storageFunctions,getDatabase, ref };


