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
    component: <PlaceholderText />,
  },
];

export default function ClubDashboard() {
  const [selectedIcon, setSelectedIcon] = useState("");

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
        {selectedIcon === "Store" && <PlaceholderText />}
      </Box>
    </Box>
  );
}

function PlaceholderText() {
  const text =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit sit amet libero in lobortis. Aliquam semper, felis id faucibus hendrerit, lorem nulla pellentesque odio, quis efficitur lectus orci vel urna. Phasellus imperdiet nisl eget semper tempor. Etiam efficitur sem sed suscipit venenatis. Suspendisse euismod est ut lectus blandit, vitae egestas risus blandit. Nullam dignissim mi ut ante efficitur, sit amet dapibus orci accumsan. Praesent vestibulum turpis nec nunc congue, id bibendum libero suscipit. Duis malesuada semper est, vel dictum enim vehicula ut. Suspendisse potenti. Sed eget sodales mi. Ut dapibus metus sit amet mi vulputate, sit amet blandit libero luctus. Etiam congue vestibulum purus, id faucibus enim pellentesque nec. Nunc ut massa id odio facilisis euismod. Nam eget arcu vel tortor faucibus suscipit in a ante.";

  return <p>{text}</p>;
}
