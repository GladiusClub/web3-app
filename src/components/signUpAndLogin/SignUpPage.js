import React, { useState } from "react";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import SportsIcon from "@mui/icons-material/Sports";
import SportsHandballIcon from "@mui/icons-material/SportsHandball";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import SignUpForm from "./SignUpForm";
import ClubSelect from "./ClubSelect";
import ClubStep2 from "./ClubLoginStep2";

function SignUp() {
  const [step, setStep] = useState(0);
  const [userType, setUserType] = useState("");
  const [userDetails, setUserDetails] = useState({});
  console.log(userDetails);

  const clubSteps = [
    <UserTypeSelection
      onSelection={(type) => {
        setUserType(type);
        setStep(step + 1);
      }}
    />,
    <SignUpForm
      userType={userType}
      onSubmit={(details) => {
        setUserDetails(details);
        setStep(step + 1);
      }}
    />,
    <ClubStep2></ClubStep2>,
  ];

  const athleteSteps = [
    <UserTypeSelection
      onSelection={(type) => {
        setUserType(type);
        setStep(step + 1);
      }}
    />,
    <SignUpForm
      userType={userType}
      onSubmit={(details) => {
        setUserDetails(details);
        setStep(step + 1);
      }}
    />,
    <ClubSelect></ClubSelect>,
  ];

  const steps = userType === "club" ? clubSteps : athleteSteps;

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {steps[step]}
    </div>
  );
}

const UserTypeSelection = ({ onSelection }) => {
  return (
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
        What type of Gladius account would you like to make?
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
          onClick={() => onSelection("club")}
        />
        <UserTypeCard
          icon={<SportsHandballIcon fontSize="large" />}
          title="Athlete/Fan"
          onClick={() => onSelection("athlete")}
        />
      </Box>
    </Box>
  );
};

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
