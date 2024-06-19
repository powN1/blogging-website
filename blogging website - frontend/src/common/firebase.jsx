import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCm7srbSDbzkq6sLjTSTbfKn_8osFddU1A",
  authDomain: "react-blog-website-71d78.firebaseapp.com",
  projectId: "react-blog-website-71d78",
  storageBucket: "react-blog-website-71d78.appspot.com",
  messagingSenderId: "404195386303",
  appId: "1:404195386303:web:815376f17989189300b70a",
};

const app = initializeApp(firebaseConfig);

// google auth

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
  let user = null;
  await signInWithPopup(auth, provider)
    .then((res) => {
      user = res.user;
    })
    .catch((err) => console.log(err));
  return user;
};
