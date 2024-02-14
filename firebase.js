import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

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
const analytics = getAnalytics(app);
const db = getDatabase(app);
const storage = getStorage(app);

export { analytics, app, db, storage };