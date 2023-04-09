import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/system";
//import { signInWithEmailAndPassword } from "firebase/auth";
//import { useFirebase } from "./firebaseContext";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

const LogInCard = styled(Card)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  padding: theme.spacing(2),
  width: "30%",
  minWidth: "300px",
  borderRadius: theme.spacing(1),
}));

const LogInFields = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  marginBottom: "10px",
}));

function LogIn() {
  //const { auth } = useFirebase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/clubdashboard");

    /* 
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        //const user = userCredential.user;
        navigate("/clubdashboard");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + errorMessage);
      });
      */
  };

  return (
    <LogInCard>
      <CardContent>
        <form>
          <LogInFields>
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
            />
          </LogInFields>
          <Typography variant="body2" sx={{ marginBottom: "10px" }}>
            Not a member,{" "}
            <Link
              to="/signup"
              style={{ textDecoration: "none", color: "#8A2BE2" }}
            >
              sign up
            </Link>{" "}
            today
          </Typography>
          <Button variant="contained" color="secondary" onClick={handleSignIn}>
            Log In
          </Button>
        </form>
      </CardContent>
    </LogInCard>
  );
}

export default LogIn;
