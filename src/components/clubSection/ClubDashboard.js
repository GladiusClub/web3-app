import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import ClubManagment from "./ClubManagement";
import Calendar from "./Calendar";
import NftMarket from "./NftMarket";
import LineChart from "./ClubAnlytics";
import DrawerComponent from "../navigation/Drawer";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import PeopleIcon from "@mui/icons-material/People";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";

export default function ClubDashboard() {
  // Initialize state from localStorage or use default
  const [selectedIcon, setSelectedIcon] = useState(
    localStorage.getItem("selectedIcon") || "People"
  );
  useEffect(() => {
    localStorage.setItem("selectedIcon", selectedIcon);
  }, [selectedIcon]);

  const handleIconClick = (iconName) => {
    setSelectedIcon(iconName);
  };

  const listItems = [
    { icon: <PeopleIcon />, name: "People" },
    { icon: <CalendarMonthIcon />, name: "Calendar" },
    { icon: <LocalGroceryStoreIcon />, name: "Store" },
    { icon: <LeaderboardIcon />, name: "Analytics" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <DrawerComponent
        handleIconClick={handleIconClick}
        listItems={listItems}
      />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {selectedIcon === "People" && <ClubManagment />}
        {selectedIcon === "Calendar" && <Calendar />}
        {selectedIcon === "Store" && <NftMarket />}
        {selectedIcon === "Analytics" && <LineChart />}
      </Box>
    </Box>
  );
}
