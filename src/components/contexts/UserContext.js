import React, { createContext, useContext, useEffect, useState } from "react";
import { useFirebase } from "./firebaseContext";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const { auth, db } = useFirebase();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        console.log("ID token: ", auth.currentUser.getIdToken(true));
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        setUserData({}); // Reset userData when the user logs out
      }
    });
    return unsubscribe;
  }, [auth, db]);


  const contextValue = {
    user,
    setUser,
    userData,
    setUserData,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
