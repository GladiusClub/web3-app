import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/system";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Box } from "@mui/material";
import { useFirebase } from "../firebaseContext";
import { getDoc, doc } from "firebase/firestore";

const LogInCard = styled(Card)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  padding: `${theme.spacing(2)}px ${theme.spacing(2)}px 0 ${theme.spacing(
    2
  )}px`,
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
  const { db, auth } = useFirebase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Athlete/Fan");

  const navigate = useNavigate();

  const handleRoleChange = (event, newRole) => {
    if (newRole !== null) {
      setRole(newRole);
    }
  };

  let timer;
  // Long press to login as a test user

  const handleButtonPress = () => {
    timer = setTimeout(() => {
      signInWithEmailAndPassword(auth, "bob@example.com", "123456")
        .then((userCredential) => {
          const uid = userCredential.user.uid;
          console.log("Bob's uid: ", uid);

          const userDocRef = doc(db, "users", uid);
          getDoc(userDocRef)
            .then((docSnapshot) => {
              if (docSnapshot.exists()) {
                const userData = docSnapshot.data();
                const ownerClubs = userData.owner;
                console.log("Bob's clubs: ", ownerClubs);

                // Retrieve the first club from the array
                const firstClubId = ownerClubs[0];
                const clubDocRef = doc(db, "clubs", firstClubId);

                getDoc(clubDocRef)
                  .then((clubDocSnapshot) => {
                    if (clubDocSnapshot.exists()) {
                      const clubData = clubDocSnapshot.data();
                      console.log("First club data: ", clubData);
                    } else {
                      console.error("No such club!");
                    }
                  })
                  .catch((error) => {
                    console.error("Error getting club data: ", error);
                  });
              } else {
                console.error("No such user!");
              }
            })
            .catch((error) => {
              console.error("Error getting user data: ", error);
            });

          navigate("/clubdashboard");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode + errorMessage);
        });
    }, 1000);
  };

  const handleButtonRelease = () => {
    clearTimeout(timer);
  };

  const handleSignIn = () => {
    if (role === "Club") {
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
    } else {
      navigate("/userdashboard");
    }
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
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSignIn}
            onMouseDown={handleButtonPress}
            onMouseUp={handleButtonRelease}
            onTouchStart={handleButtonPress}
            onTouchEnd={handleButtonRelease}
          >
            Log In
          </Button>
        </form>
      </CardContent>
      <Box sx={{ width: 1, marginTop: "10px" }}>
        <ToggleButtonGroup
          color="secondary"
          value={role}
          exclusive
          onChange={handleRoleChange}
          fullWidth
        >
          <ToggleButton
            value="Athlete/Fan"
            sx={{
              flexGrow: 1,
              borderRadius: "0 0 4px 4px",
              border: "none",
              borderTop: "0.4px solid",
              borderRight: "0.2px solid",
            }}
          >
            Athlete/Fan
          </ToggleButton>
          <ToggleButton
            value="Club"
            sx={{
              flexGrow: 1,
              borderRadius: "0 0 4px 4px",
              border: "none",
              borderTop: "0.4px solid",
              borderLeft: "0.2px solid",
            }}
          >
            Club
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </LogInCard>
  );
}

export default LogIn;
