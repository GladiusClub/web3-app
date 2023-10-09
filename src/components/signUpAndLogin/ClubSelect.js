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
import { usePublicClubs } from "../CustomHooks/usePublicClubs";

export default function ClubSelect() {
  const clubs = usePublicClubs();
  const clubNames = Object.values(clubs);
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
    width: 200,
    height: 200,
  };

  const innerContentStyle = {
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", // Change to 'space-between' to push the button to the bottom
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
    <div>
      <Box display="flex" justifyContent="center" marginBottom="1em">
        <Button variant="contained" color="secondary" onClick={handleSignIn}>
          Enter Gladius
        </Button>
      </Box>
      {clubNames.length > 0 ? (
        <Grid container justifyContent="center" spacing={14}>
          {clubNames.map((name, index) => (
            <Grid key={index} item sm={6}>
              <Card style={cardStyle}>
                <div style={innerContentStyle}>
                  <SportsSoccerIcon style={{ fontSize: 80 }} />
                  <CardContent style={{ flex: 1, marginBottom: "auto" }}>
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
                        value="Athlete"
                        sx={{
                          flex: 1,
                          borderRadius: "0 0 4px 4px",
                          border: "none",
                          borderTop: "0.4px solid",
                        }}
                      >
                        Join
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </CardActions>
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : null}
    </div>
  );
}
