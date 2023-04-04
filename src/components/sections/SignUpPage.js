import React, { useState } from "react";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import SportsIcon from "@mui/icons-material/Sports";
import SportsHandballIcon from "@mui/icons-material/SportsHandball";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import SignUpForm from "../SignUpForm";

function SignUp() {
  const [userType, setUserType] = useState("");

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
      {userType ? (
        <SignUpForm userType={userType} />
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
