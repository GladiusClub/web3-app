import "./App.css";
import React from "react";
import { signOut } from "firebase/auth";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import Button from "@mui/material/Button";
import { useFirebase } from "./components/firebaseContext";
import { useUser } from "./components/UserContext";

function App() {
  const { user, address, setAddress } = useUser();
  const { auth } = useFirebase();
  console.log(address);

  const handleSignOut = () => {
    signOut(auth);

    setAddress(null)
      .then(() => {
        console.log("User signed out");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {user ? (
        <>
          <p>User is logged in</p>
          <Button onClick={handleSignOut}>Log Out</Button>
        </>
      ) : (
        <>
          <p>bob@123.com : 123456</p>
          <SignUp />
          <LogIn />
        </>
      )}
      {address ? (
        <p>Your wallet address is {address}!</p>
      ) : (
        <p>No wallet found</p>
      )}
    </>
  );
}

export default App;
