import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { createNewWallet } from "./EthConnector";
import { setDoc, doc } from "firebase/firestore";
import { useFirebase } from "./firebaseContext";
import { styled } from "@mui/system";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import SportsIcon from "@mui/icons-material/Sports";
import SportsHandballIcon from "@mui/icons-material/SportsHandball";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";

function SignUp() {
  const { auth, db } = useFirebase();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [club, setClub] = useState("");
  const [userType, setUserType] = useState("");

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

  const handleUserTypeSelection = (type) => {
    setUserType(type);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CardContent>
        {userType ? (
          <form>
            <SignUpFields>
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
              <Button
                variant="contained"
                color="primary"
                onClick={handleFakeUsers}
              >
                Create Fake Users
              </Button>
            </SignUpFields>
          </form>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "60px", // Adjust this value to your desired spacing
            }}
          >
            <Typography variant="h6" component="div">
              What are you doing here?
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                gap: "52px",
              }}
            >
              <UserTypeCard
                icon={<SportsIcon fontSize="large" />}
                title="Club"
                onClick={() => handleUserTypeSelection("club")}
              />
              <UserTypeCard
                icon={<SportsHandballIcon fontSize="large" />}
                title="Athlete"
                onClick={() => handleUserTypeSelection("athlete")}
              />
            </Box>
          </Box>
        )}
      </CardContent>
    </div>
  );
}

const UserTypeCard = ({ icon, title, onClick }) => (
  <Card sx={{ width: "400px", height: "400px" }}>
    <CardActionArea
      onClick={onClick}
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

export default SignUp;

const SignUpFields = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  marginBottom: "10px",
}));
