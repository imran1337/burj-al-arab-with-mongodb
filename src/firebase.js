import firebase from "firebase/app";
import "firebase/auth";

const app = firebase.initializeApp({
  apiKey: "AIzaSyAAbhykF6RuHlLMLwcxqLC48dqMXCjNK2Y",
  authDomain: "burj-al-arab-e4553.firebaseapp.com",
  projectId: "burj-al-arab-e4553",
  storageBucket: "burj-al-arab-e4553.appspot.com",
  messagingSenderId: "450825463641",
  appId: "1:450825463641:web:af878d10e5dc7cf6aa0e48",
});

export const auth = app.auth();
export default app;
