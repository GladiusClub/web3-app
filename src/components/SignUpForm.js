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
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/system";
import Typography from "@mui/material/Typography";
import { estonianSportsClubs } from "../fakeData";
import { Link } from "react-router-dom";

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

  const SignUpCard = styled(Card)(({ theme }) => ({
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    padding: theme.spacing(2),
    width: "30%",
    minWidth: "300px",
    borderRadius: theme.spacing(1),
  }));

  const SignUpFields = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    marginBottom: "10px",
  }));

  return (
    <SignUpCard>
      <CardContent>
        <form>
          <SignUpFields>
            <Typography variant="h5" sx={{ marginBottom: "10px" }}>
              Create a new {userType}
            </Typography>
            <TextField
              label="Name"
              type="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              color="secondary"
              sx={{
                marginBottom: "10px",
              }}
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              color="secondary"
              sx={{
                marginBottom: "10px",
              }}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              color="secondary"
              sx={{
                marginBottom: "10px",
              }}
            />
            <FormControl
              fullWidth
              color="secondary"
              sx={{ marginBottom: "10px" }}
            >
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
          </SignUpFields>
          <Typography variant="body2" sx={{ marginBottom: "10px" }}>
            Already a member?{" "}
            <Link
              to="/login"
              style={{ textDecoration: "none", color: "#8A2BE2" }}
            >
              log in
            </Link>{" "}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSignUp}
            sx={{ marginBottom: "10px" }}
          >
            Create {userType}
          </Button>
        </form>
      </CardContent>
    </SignUpCard>
  );
}

export default SignUpForm;