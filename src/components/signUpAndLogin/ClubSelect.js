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
import { useFirebase } from "../contexts/firebaseContext";
import { doc, setDoc, arrayUnion } from "firebase/firestore";

export default function ClubSelect({ firebaseUser }) {
  const clubs = usePublicClubs();
  const clubNames = Object.values(clubs);
  const navigate = useNavigate();
  const [joinedClubs, setJoinedClubs] = useState([]);
  const { db } = useFirebase();

  const handleClubSelect = (clubId) => (event, newRole) => {
    setJoinedClubs((prevClubs) => {
      if (newRole === clubId && !prevClubs.includes(clubId)) {
        return [...prevClubs, clubId];
      } else if (!newRole && prevClubs.includes(clubId)) {
        return prevClubs.filter((id) => id !== clubId);
      }
      return prevClubs;
    });
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

  const handleSignIn = async () => {
    if (firebaseUser) {
      // Prepare club_roles data
      const clubRoles = joinedClubs.map((clubId) => ({
        club_id: clubId,
        role: "athlete",
      }));

      // Reference to the user's document in Firestore
      const userDocRef = doc(db, "users", firebaseUser.uid);

      // Update the user's document with the club_roles
      await setDoc(
        userDocRef,
        { clubs_roles: arrayUnion(...clubRoles) },
        { merge: true }
      );
      navigate("/userdashboard");
    }
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
                      onChange={handleClubSelect(Object.keys(clubs)[index])}
                      value={
                        joinedClubs.includes(Object.keys(clubs)[index])
                          ? Object.keys(clubs)[index]
                          : null
                      }
                      fullWidth
                    >
                      <ToggleButton
                        value={Object.keys(clubs)[index]}
                        sx={{
                          flex: 1,
                          borderRadius: "0 0 4px 4px",
                          border: "none",
                          borderTop: "0.4px solid",
                          backgroundColor: joinedClubs.includes(
                            Object.keys(clubs)[index]
                          )
                            ? "grey"
                            : "white", // color the button based on whether the club id is in the state
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
