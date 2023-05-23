import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/system";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

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

function SignUpForm({ userType, onSubmit }) {
  const [clubName, setClubName] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    onSubmit({
      clubName: clubName,
      name: name,
      email: email,
      password: password,
    });
  };

  const handleUploadClick = (event) => {
    // Handle upload click
  };

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
  