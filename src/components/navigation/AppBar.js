import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../UserContext";
import { signOut } from "firebase/auth";
import { useFirebase } from "../firebaseContext";
import { AccountCircle, Settings } from "@mui/icons-material"; // Import the profile icon
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import WalletIcon from "@mui/icons-material/Wallet";

const pages = ["For Users", "For Clubs"];

export default function TopBar() {
  const location = useLocation();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          background: "linear-gradient(to right, #1c2b4b, #9b1aff)",
          zIndex: 9999,
        }}
      >
        <Toolbar>
          <Link to="/" style={{ textDecoration: "none", color: "#8A2BE2" }}>
            <Typography
              variant="h6"
              component="div"
              sx={{ marginRight: "20px" }}
            >
              GLADIUS
            </Typography>
          </Link>
          {location.pathname === "/clubdashboard" ||
          location.pathname === "/userdashboard" ? null : (
            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
              {pages.map((page) => (
                <MenuItem key={page}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            <AuthButtons />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

function AuthButtons() {
  const location = useLocation();
  const { user } = useUser();
  const { auth } = useFirebase();

  const handleLogout = () => {
    signOut(auth);
  };

  const LoggedIn = () => (
    <>
      <p>{user.email}</p>
      <Button
        variant="contained"
        color="secondary"
        sx={{ marginLeft: "10px" }}
        onClick={handleLogout}
      >
        Log Out
      </Button>
    </>
  );

  const ClubDashboard = () => (
    <>
      <AccountCircle sx={{ marginRight: "10px" }} />
      <Settings sx={{ marginRight: "10px" }} />
      <ShoppingCartIcon sx={{ marginRight: "10px" }} />
      <Button
        variant="contained"
        color="secondary"
        sx={{ marginLeft: "10px" }}
        onClick={handleLogout}
      >
        Log Out
      </Button>
    </>
  );

  const UserDashboard = () => (
    <>
      <WalletIcon sx={{ marginRight: "10px" }} />
      <Button
        variant="contained"
        color="secondary"
        sx={{ marginLeft: "10px" }}
        onClick={handleLogout}
      >
        Log Out
      </Button>
    </>
  );

  const LoginButton = () => (
    <Link to="/login" style={{ textDecoration: "none", color: "#8A2BE2" }}>
      <Button variant="contained" color="secondary" sx={{ marginLeft: "10px" }}>
        Login
      </Button>
    </Link>
  );

  const SignupButton = () => (
    <Link to="/signup" style={{ textDecoration: "none", color: "#8A2BE2" }}>
      <Button variant="contained" color="secondary" sx={{ marginLeft: "10px" }}>
        Sign Up
      </Button>
    </Link>
  );

  const renderAuthButtons = () => {
    if (location.pathname === "/clubdashboard") {
      return <ClubDashboard />;
    }
    if (location.pathname === "/userdashboard") {
      return <UserDashboard />;
    }
    if (user) {
      return <LoggedIn />;
    }

    return location.pathname === "/signup" ? <LoginButton /> : <SignupButton />;
  };
  return renderAuthButtons();
}
