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
import Podium from "./Podium";
//import LeaderboardTable from "./LeaderBoardTable";

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
      <DrawerComponent handleIconClick={() => {}} listItems={listItems} />

      <Box sx={{ display: "flex", flexDirection: "column", p: 3 }}>
        <Podium />

        <H2 sx={{ mt: 0 }}>Assets</H2>
        <Balance address={userData?.address || ""} />
        <SendTransactionCard clubMembers={clubMembers ? clubMembers : []} />
        <Box sx={{ width: "50vw" }}>{/* <LeaderboardTable /> */}</Box>
      </Box>
    </Box>
  );
  
}
