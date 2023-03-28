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

  const fakeNames = ["Tõnu", "Piret", "Mart", "Anu", "Toomas"];
  const estonianSportsClubs = [
    "Kalev FC",
    "Tartu Ülikooli Korvpalliklubi",
    "Tallinna Jalgpalliklubi",
    "Pärnu Spordiselts",
    "Narva Võrkpalliklubi",
  ];

  const handleFakeUsers = () => {
    for (let i = 0; i < fakeNames.length; i++) {
      const name = fakeNames[i];
      const email = `fake${i}@example.com`;
      const wallet = createNewWallet();
      console.log(wallet);

      // Loop through each sports club and add the user to their members collection
      for (let j = 0; j < estonianSportsClubs.length; j++) {
        const club = estonianSportsClubs[j];
        setDoc(doc(db, "club", club, "members", name), {
          name: name,
          email: email,
          address: wallet.address,
          privateKey: wallet.privateKey,
          club: club,
        }).catch((error) => {
          console.error("Error adding document: ", error);
        });
      }
    }
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
        Create A New User
      </Button>
      <Button variant="contained" color="primary" onClick={handleFakeUsers}>
        Create Fake Users
      </Button>
    </form>
  );
}

export default SignUp;
