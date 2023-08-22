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
import { useFirebase } from "../contexts/firebaseContext";
import { doc, getDoc } from "firebase/firestore";

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

  const navigate = useNavigate();

  let timer;
  // Long press to login as a test user

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const userRef = doc(db, "users", userCredential.user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          const clubRoles = userData.clubs_roles;
          console.log(clubRoles);

          if (clubRoles && clubRoles.length > 0) {
            const firstRole = clubRoles[0];
            const userRole = firstRole.role;

            if (userRole === "owner") {
              navigate("/clubdashboard");
            } else {
              navigate("/userdashboard");
            }
          } else {
            navigate("/userdashboard"); // Default navigation if club_roles does not exist or is empty
          }
        } else {
          console.error("User document does not exist!");
          // Handle this case, maybe navigate to a default route or show an error
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + errorMessage);
      });
  };

  const handleButtonRelease = () => {
    clearTimeout(timer);
  };

  const handleButtonPress = () => {
    timer = setTimeout(() => {
      signInWithEmailAndPassword(auth, "bob@example.com", "123456")
        .then((userCredential) => {
          const uid = userCredential.user.uid;
          const user = userCredential.user;
          console.log("Bob's uid: ", uid);
          user.getIdToken(/* forceRefresh */ true).then((idToken) => {
            console.log("Token: ", idToken);
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
    </LogInCard>
  );
}

export default LogIn;
