import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import DateRangeIcon from "@mui/icons-material/DateRange";
import GroupsIcon from "@mui/icons-material/Groups";
import Box from "@mui/material/Box";
import { Grid } from "@mui/material";

export default function GroupGrid() {
  const cards = [
    "Adult Soccer",
    "Youth Basketball",
    "Senior Swimming",
    "Women's Volleyball",
    "Men's Tennis",
  ]; // replace this with actual data

  return (
    <Grid container spacing={2}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <GroupManagment title={card} />
        </Grid>
      ))}
    </Grid>
  );
}

function GroupManagment({ title }) {
  return (
    <Card sx={{ minWidth: 100, margin: "10px", maxHeight: 150 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            mb: 1, // margin-bottom
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <GroupsIcon sx={{ fontSize: 60 }} />
            <Typography variant="subtitle1" align="center">
              Members
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <DateRangeIcon sx={{ fontSize: 60 }} />
            <Typography variant="subtitle1" align="center">
              Events
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
