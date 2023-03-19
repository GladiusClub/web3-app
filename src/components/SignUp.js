import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { createNewWallet } from "./EthConnector";
import { setDoc, doc } from "firebase/firestore";
import { useFirebase } from "./firebaseContext";

function SignUp() {
  const { auth, db } = useFirebase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const wallet = createNewWallet();
        console.log(wallet);

        setDoc(doc(db, "users", user.uid), {
          address: wallet.address,
          privateKey: wallet.privateKey,
        }).catch((error) => {
          console.error("Error adding document: ", error);
        });

        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + errorMessage);
      });
  };

  return (
    <form>
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleSignUp}>
        Sign Up
      </Button>
    </form>
  );
}

export default SignUp;
