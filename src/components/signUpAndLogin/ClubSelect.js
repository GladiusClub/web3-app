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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";

import { usePublicClubs } from "../CustomHooks/usePublicClubs";
import { useFirebase } from "../contexts/firebaseContext";

export default function ClubSelect({ firebaseUser }) {
  const clubs = usePublicClubs();
  const clubNames = Object.values(clubs);
  const navigate = useNavigate();
  const [joinedClub, setJoinedClub] = useState(null); // State for the currently joined club

  const { db } = useFirebase();

  const handleClubSelect = (clubId) => async () => {
    setJoinedClub(clubId); // Set the joined club

    // Once state is updated, make call to Firebase to update the clubs
    if (firebaseUser) {
      const userDocRef = doc(db, "users", firebaseUser.uid);
      await setDoc(
        userDocRef,
        { clubs_roles: [{ club_id: clubId, role: "athlete" }] }, // Set the club_roles to the selected club
        { merge: true }
      );

      navigate("/userdashboard"); // Navigate to the user dashboard
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

  return (
    <div>
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
                        joinedClub === Object.keys(clubs)[index]
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
                          backgroundColor:
                            joinedClub === Object.keys(clubs)[index]
                              ? "grey"
                              : "white",
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
