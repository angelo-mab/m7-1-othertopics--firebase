import React, { createContext, useEffect, useState } from 'react';
import withFirebaseAuth from 'react-with-firebase-auth';
import * as firebase from 'firebase';
import 'firebase/auth';

export const AppContext = createContext(null);

let firebaseConfig = {
  apiKey: "AIzaSyARjO2wygP6kr2MViGCQPalySlwaNPzpmg",
  authDomain: "user-app-d1a32.firebaseapp.com",
  databaseURL: "https://user-app-d1a32.firebaseio.com",
  projectId: "user-app-d1a32",
  storageBucket: "user-app-d1a32.appspot.com",
  messagingSenderId: "477637045267",
  appId: "1:477637045267:web:79c8a1cbb86f903de6a3e6"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();

const providers = { googleProvider: new firebase.auth.GoogleAuthProvider() };

const AppProvider = ({ children, signInWithGoogle, signOut, user }) => {
  const [appUser, setAppUser] = useState({});
  const [message, setMessage] = useState('');

  const handleSignOut = () => {
    signOut();
    setAppUser({});
  };

  useEffect(() => {
    if (user) {
      fetch(`/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dislayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          setAppUser(json.data);
          setMessage(json.message);
        });
    }
  }, [user]);

  return <AppContext.Provider value={{ appUser, signInWithGoogle, handleSignOut, message }}>{children}</AppContext.Provider>;
};

export default withFirebaseAuth({
  providers, firebaseAppAuth,
})(AppProvider);
