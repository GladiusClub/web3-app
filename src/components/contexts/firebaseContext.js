import React, { useContext } from "react";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // 1. Import method for Firebase Storage

const FirebaseContext = React.createContext(null);


const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MEASURMENTID,  
  OPENAI_API_KEY:process.env.OPENAI_API_KEY,
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);  // 2. Initialize Firebase Storage

const contextValue = {
  auth,
  db,
  storage,  // 3. Add storage to context value
};

export function FirebaseProvider(props) {
  return (
    <FirebaseContext.Provider value={contextValue}>
      {props.children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  return context;
}