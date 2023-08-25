import React, { useState, useEffect } from "react";
import { H2 } from "../styles/TextStyles";
import Balance from "../BalanceCard";
import { Box } from "@mui/system";
import DrawerComponent from "../navigation/Drawer";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleIcon from "@mui/icons-material/People";
import { useUser } from "../contexts/UserContext";
import { useClub } from "../contexts/clubContext";
import SendTransactionCard from "../SendTransactionCard";

const listItems = [
  { icon: <PeopleIcon />, name: "People" },
  { icon: <CalendarMonthIcon />, name: "Calendar" },
];

export default function UserDashboard() {
  const { userData } = useUser();
  const { clubs } = useClub();
  const [clubMembers, setClubMembers] = useState();

  useEffect(() => {
    if (clubs[0]) {
      setClubMembers(clubs[0].members);
    }
  }, [clubs]);

  return (
    <Box sx={{ display: "flex" }}>
      <DrawerComponent
        handleIconClick={() => {}}
        listItems={listItems}
      ></DrawerComponent>
      <Box sx={{ display: "flex", flexDirection: "row", p: 3 }}>
        <Box>
          <H2>Assets</H2>
          <Balance address={userData?.address || ""}></Balance>
          <SendTransactionCard clubMembers={clubMembers ? clubMembers : []} />
        </Box>
      </Box>
    </Box>
  );
}
