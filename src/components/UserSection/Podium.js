import React from "react";
import crownSrc from "../../img/Crown.svg";
import pugSrc from "../../img/pug.png";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function UserBox({ showCrown, username, level, rank }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {showCrown && (
        <img
          src={crownSrc}
          alt="Crown"
          width="70"
          height="65.88"
          style={{ zIndex: 2, position: "relative" }}
        />
      )}

      <Box
        sx={{
          width: rank === 1 ? 110.88 : 90.88,
          height: rank === 1 ? 155.97 : 135.97,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFF",
          mt: showCrown ? -4.3 : 0, // Adjust marginTop when crown is not there
        }}
      >
        <Avatar
          sx={{
            width: rank === 1 ? 56 : 46,
            height: rank === 1 ? 56 : 46,
            borderColor:
              rank === 1 ? "#FFCA28" : rank === 2 ? "#F4F4F4" : "#FF8228",
            borderWidth: 3,
            borderStyle: "solid",
          }}
          alt="User Avatar"
          src={pugSrc}
        />
        <Box
          sx={{
            width: 14, // Adjust the width and height as needed
            height: 14,
            borderRadius: "50%",
            backgroundColor:
              rank === 1 ? "#FFCA28" : rank === 2 ? "#F4F4F4" : "#FF8228",
            border: "2px solid #FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: -1.2,
            position: "relative", // add position relative so that zIndex applies to this component.
            zIndex: 3,
          }}
        >
          <Typography variant="caption" component="div" color="text.primary">
            {rank}
          </Typography>
        </Box>

        <Typography
          variant="subtitle1"
          component="div"
          color="secondary"
          sx={{ mt: 1, fontSize: 10, position: "relative", zIndex: 10 }}
        >
          {username}
        </Typography>

        <Typography
          variant="subtitle2"
          component="div"
          color="Gray"
          sx={{ mt: 0, fontSize: 10, position: "relative", zIndex: 10 }}
        >
          Level {level}
        </Typography>
      </Box>
    </Box>
  );
}

function Podium() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: -6,
      }}
    >
      <Box sx={{ marginRight: "-30px" }}>
        {" "}
        {/* Adjust this value */}
        <UserBox username="User One" level={25} rank={2} />
      </Box>

      <UserBox username="Good Boy" level={32} rank={1} showCrown />

      <Box sx={{ marginLeft: "-30px" }}>
        {" "}
        {/* Adjust this value */}
        <UserBox username="User Two" level={20} rank={3} />
      </Box>
    </Box>
  );
}

export default Podium;
