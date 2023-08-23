import * as React from "react";
import { H2 } from "../styles/TextStyles";
import Balance from "../BalanceCard";
import { Box } from "@mui/system";
import DrawerComponent from "../navigation/Drawer";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleIcon from "@mui/icons-material/People";
import { useUser } from "../contexts/UserContext";
import { useClub } from "../contexts/clubContext";

const listItems = [
  { icon: <PeopleIcon />, name: "People" },
  { icon: <CalendarMonthIcon />, name: "Calendar" },
];

export default function UserDashboard() {
  const { userData } = useUser();
  const { clubs } = useClub();
  console.log(clubs[0]);

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
        </Box>
      </Box>
    </Box>
  );
}
