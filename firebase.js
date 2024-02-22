import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyAHfTtMp6QIkc8i-UlwcjjpYs6oWzH90NA",
//   authDomain: "microfab-admin.firebaseapp.com",
//   databaseURL: "https://microfab-admin-default-rtdb.firebaseio.com",
//   projectId: "microfab-admin",
//   storageBucket: "microfab-admin.appspot.com",
//   messagingSenderId: "949509913271",
//   appId: "1:949509913271:web:7fba49e66f7a592ce2ab32",
//   measurementId: "G-B1KM0RLBQN",
// };

const firebaseConfig = {
  apiKey: "AIzaSyDRNf_YlzJhIos4NRMnJ2AGMIkugJ0kV_M",
  authDomain: "coin-94280.firebaseapp.com",
  databaseURL: "https://coin-94280-default-rtdb.firebaseio.com",
  projectId: "coin-94280",
  storageBucket: "coin-94280.appspot.com",
  messagingSenderId: "726875973513",
  appId: "1:726875973513:web:0a4872c3220a4e7da2e358",
  measurementId: "G-ZBTVKV0CVG"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const storage = getStorage(app);

export { analytics, app, db, storage };