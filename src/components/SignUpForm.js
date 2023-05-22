import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
//import { createUserWithEmailAndPassword } from "firebase/auth";
//import { createNewWallet } from "./EthConnector";
//import { setDoc, doc } from "firebase/firestore";
//import { useFirebase } from "./firebaseContext";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/system";
import Typography from "@mui/material/Typography";
//import { estonianSportsClubs } from "../fakeData";
import { Link } from "react-router-dom";
//import { useNavigate } from "react-router-dom";

function SignUpForm({ userType, onSubmit }) {
  //const { auth, db } = useFirebase();
  const [clubName, setClubName] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  //const navigate = useNavigate();

  const handleSignUp = () => {
    onSubmit({
      clubName: clubName,
      name: name,
      email: email,
      password: password,
    });
  };

  const handleUploadClick = (event) => {
    // TODO: Handle the click event to open a file dialog
    // and upload the selected file as the club's logo
  };
  /* 
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
  */

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
            <Typography
              variant="h5"
              sx={{ marginBottom: "10px" }}
              align="center"
            >
              Create a new Gladius Account
            </Typography>
            {userType === "club" && (
              <UploadLogoButton onClick={handleUploadClick} />
            )}
            {userType === "club" && (
              <TextField
                label="Club Name"
                type="name"
                value={name}
                onChange={(e) => setClubName(e.target.value)}
                color="secondary"
                sx={{
                  marginBottom: "10px",
                }}
              />
            )}
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

            {/* 
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
      */}
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
            /*
            onClick={() => {
              if (userType === "club") {
                navigate("/clubdashboard");
              } else {
                navigate("/userdashboard");
              }
            }}
            */
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

function UploadLogoButton({ onClick }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "16px",
      }}
    >
      <IconButton
        color="primary"
        aria-label="upload picture"
        component="span"
        onClick={onClick}
      >
        <Avatar sx={{ width: 56, height: 56, backgroundColor: "grey.500" }}>
          <PhotoCamera sx={{ color: "white" }} />
        </Avatar>
      </IconButton>
      <Typography variant="body1">Add your club logo</Typography>
    </div>
  );
}