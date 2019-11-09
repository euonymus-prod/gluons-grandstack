import React from "react";
import { FirebaseContext, withFirebase } from "firebase-context";
import Firebase from "./firebase";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};

// new Firebase(config)
const withFirebaseProvider = Component => props => (
  <FirebaseContext.Provider value={new Firebase(config)}>
    <Component {...props} />
  </FirebaseContext.Provider>
);

export { withFirebase, withFirebaseProvider };
export default FirebaseContext;
