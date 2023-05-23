import React from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

export default function ClubStep2() {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/clubdashboard");
  };

  return (
    <Box display="flex" justifyContent="center" marginBottom="1em">
      <Button variant="contained" color="secondary" onClick={handleSignIn}>
        Enter Gladius
      </Button>
    </Box>
  );
}
