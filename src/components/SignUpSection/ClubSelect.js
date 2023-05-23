import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import React, { useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const clubNames = [
  "Tallinn Titans",
  "Narva Ninjas",
  "Pärnu Panthers",
  "Tartu Tornadoes",
  "Saaremaa Sharks",
  "Hiiumaa Hawks",
  "Viljandi Vipers",
  "Rakvere Raiders",
  "Kohtla-Järve Jaguars",
  "Võru Vikings",
  "Jõhvi Jackals",
  "Kuressaare Koalas",
  "Valga Vultures",
  "Haapsalu Hurricanes",
  "Sillamäe Stallions",
  "Paide Pythons",
  "Elva Eagles",
  "Rapla Raptors",
  "Põlva Panthers",
  "Jõgeva Jokers",
];

export default function ClubSelect() {
  const [role, setRole] = useState(new Array(clubNames.length).fill(null));
  const navigate = useNavigate();

  const handleRoleChange = (index) => (event, newRole) => {
    if (newRole !== null) {
      setRole((prevState) => {
        const newRoles = [...prevState];
        newRoles[index] = newRole;
        return newRoles;
      });
    }
  };

  const cardStyle = {
    maxWidth: 200,
    maxHeight: 200,
    margin: 16,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  const textStyle = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const handleSignIn = () => {
    navigate("/userdashboard");
  };

  return (
    <div style={{ marginTop: "1100px", minHeight: "auto" }}>
      <Box display="flex" justifyContent="center" marginBottom="1em">
        <Button variant="contained" color="secondary" onClick={handleSignIn}>
          Enter Gladius
        </Button>
      </Box>

      <Grid container justifyContent="center" spacing={4}>
        {clubNames.map((name, index) => (
          <Grid key={index} item xs={12} sm={6} md={4}>
            <Card style={cardStyle}>
              <SportsSoccerIcon style={{ fontSize: 80 }} />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  align="center"
                  style={textStyle}
                >
                  {name}
                </Typography>
              </CardContent>
              <CardActions style={{ width: "100%" }}>
                <ToggleButtonGroup
                  color="secondary"
                  exclusive
                  aria-label="Platform"
                  onChange={handleRoleChange(index)}
                  value={role[index]}
                  fullWidth
                >
                  <ToggleButton
                    value="Fan"
                    sx={{
                      flexGrow: 1,
                      borderRadius: "0 0 4px 4px",
                      border: "none",
                      borderTop: "0.4px solid",
                      borderRight: "0.2px solid",
                    }}
                  >
                    Fan
                  </ToggleButton>
                  <ToggleButton
                    value="Athlete"
                    sx={{
                      flexGrow: 1,
                      borderRadius: "0 0 4px 4px",
                      border: "none",
                      borderTop: "0.4px solid",
                      borderLeft: "0.2px solid",
                    }}
                  >
                    Athlete
                  </ToggleButton>
                </ToggleButtonGroup>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
