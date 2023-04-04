import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { createNewWallet } from "./EthConnector";
import { setDoc, doc } from "firebase/firestore";
import { useFirebase } from "./firebaseContext";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { fakeNames, estonianSportsClubs } from "../fakeData";
import { H1 } from "./styles/TextStyles";

function SignUpForm({ userType }) {
  const { auth, db } = useFirebase();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [club, setClub] = useState("");

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

  const handleFakeUsers = () => {
    for (let i = 0; i < fakeNames.length; i++) {
      const name = fakeNames[i];
      const email = `fake${i}@example.com`;
      const wallet = createNewWallet();

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
    <div>
      <H1>Welcome new {userType}</H1>
      <TextField
        label="Name"
        type="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        inputProps={{
          autoComplete: "new-password",
          form: {
            autocomplete: "off",
          },
        }}
        sx={{
          marginBottom: "10px",
        }}
      />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        inputProps={{
          autoComplete: "new-password",
          form: {
            autocomplete: "off",
          },
        }}
        sx={{
          marginBottom: "10px",
        }}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        inputProps={{
          autoComplete: "new-password",
          form: {
            autocomplete: "off",
          },
        }}
        sx={{
          marginBottom: "10px",
        }}
      />
      <FormControl fullWidth sx={{ marginBottom: "10px" }}>
        <InputLabel>Club</InputLabel>
        <Select
          value={club}
          onChange={(e) => setClub(e.target.value)}
          label="Club"
        >
          {estonianSportsClubs.map((club, index) => (
            <MenuItem key={index} value={club}>
              {club}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSignUp}
        sx={{
          marginBottom: "10px",
        }}
      >
        Create A New User
      </Button>
      <Button variant="contained" color="primary" onClick={handleFakeUsers}>
        Create Fake Users
      </Button>
    </div>
  );
}

export default SignUpForm;

//const SignUpFields = styled("div")(({ theme }) => ({
//    display: "flex",
//    flexDirection: "column",
//    marginBottom: "10px",
//  }));
