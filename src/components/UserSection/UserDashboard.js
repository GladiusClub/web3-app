import React, { useState, useEffect } from "react";
import { H2 } from "../styles/TextStyles";
import Balance from "../BalanceCard";
import { Box } from "@mui/system";
import DrawerComponent from "../navigation/Drawer";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleIcon from "@mui/icons-material/People";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useUser } from "../contexts/UserContext";
import { useClub } from "../contexts/clubContext";
import SendTransactionCard from "../SendTransactionCard";
import Podium from "./Podium";
import Leaderboard from "./LeaderBoard";
//import UpLoadImage from "./UpLoadImage";
import useGenerateAvatar from "../CustomHooks/useGenerateAvatar";

export default function UserDashboard() {
  // Initialize state from localStorage or use default
  const [selectedIcon, setSelectedIcon] = useState(
    localStorage.getItem("selectedIcon") || "People"
  );

  useEffect(() => {
    localStorage.setItem("selectedIcon", selectedIcon);
  }, [selectedIcon]);

  const { user, userData } = useUser();
  const { clubs } = useClub();
  const [clubMembers, setClubMembers] = useState();
  const { generateAvatar, isLoading, avatarData } = useGenerateAvatar();

  useEffect(() => {
    console.log("Generating avatar on component mount");
    generateAvatar("A red hat"); // This will only run once, when the component mounts
  }, []);

  useEffect(() => {
    if (clubs[0]) {
      setClubMembers(clubs[0].members);
    }
  }, [clubs]);

  const handleIconClick = (iconName) => {
    setSelectedIcon(iconName);
  };

  const listItems = [
    { icon: <PeopleIcon />, name: "People" },
    { icon: <CalendarMonthIcon />, name: "Calendar" },
    { icon: <AccountCircleIcon />, name: "Profile" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <DrawerComponent
        handleIconClick={handleIconClick}
        listItems={listItems}
      />

      <Box sx={{ display: "flex", flexDirection: "column", p: 3 }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Podium />
          <Leaderboard />
        </Box>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {selectedIcon === "Profile"}
        </Box>

        <H2 sx={{ mt: 0 }}>Assets</H2>
        <Balance address={userData?.address || ""} />
        <SendTransactionCard clubMembers={clubMembers ? clubMembers : []} />
        <Box sx={{ width: "50vw" }}></Box>
      </Box>
    </Box>
  );
}
