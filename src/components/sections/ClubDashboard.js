import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import PeopleIcon from "@mui/icons-material/People";
import Box from "@mui/material/Box";
import ClubManagment from "./ClubManagement";
import Calendar from "./Calendar";
import NftMarket from "./NftMarket";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const listItems = [
  { icon: <PeopleIcon />, name: "People", component: <ClubManagment /> },
  { icon: <CalendarMonthIcon />, name: "Calendar", component: <Calendar /> },
  {
    icon: <LocalGroceryStoreIcon />,
    name: "Store",
    component: <NftMarket />,
  },
];

export default function ClubDashboard() {
  const [selectedIcon, setSelectedIcon] = useState("People");

  const handleIconClick = (iconName) => {
    setSelectedIcon(iconName);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer variant="permanent">
        <DrawerHeader></DrawerHeader>
        <Divider />
        <List>
          {listItems.map((item, index) => (
            <ListItem
              key={index}
              disablePadding
              sx={{ display: "block" }}
              onClick={() => handleIconClick(item.name)}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {selectedIcon === "People" && <ClubManagment />}
        {selectedIcon === "Calendar" && <Calendar />}
        {selectedIcon === "Store" && <NftMarket />}
      </Box>
    </Box>
  );
}


