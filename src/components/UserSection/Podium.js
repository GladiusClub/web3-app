// UserBox Component

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
          width: 110.88,
          height: 155.97,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFF",
          mt: showCrown ? -3.7 : 1, // Adjust marginTop when crown is not there
        }}
      >
        <Avatar
          sx={{
            width: 56,
            height: 56,
            borderColor: "#FFCA28",
            borderWidth: 3,
            borderStyle: "solid",
          }}
          alt="User Avatar"
          src={pugSrc}
        />
        <Box
          sx={
            {
              // ... same as your current style
            }
          }
        >
          <Typography variant="caption" component="div" color="text.primary">
            {rank}
          </Typography>
        </Box>

        <Typography
          variant="subtitle1"
          component="div"
          color="secondary"
          sx={{ mt: 1 }}
        >
          {username}
        </Typography>

        <Typography
          variant="subtitle2"
          component="div"
          color="secondary"
          sx={{ mt: 1 }}
        >
          Level {level}
        </Typography>
      </Box>
    </Box>
  );
}

// Podium Component

function Podium() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <UserBox username="User One" level={25} rank={3} />
      <UserBox username="Good Boy" level={32} rank={1} showCrown />
      <UserBox username="User Two" level={20} rank={2} />
    </Box>
  );
}

export default Podium;
