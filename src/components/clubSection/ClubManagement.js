import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import BalanceCard from "../BalanceCard";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SportsIcon from "@mui/icons-material/Sports";
import SportsHandballIcon from "@mui/icons-material/SportsHandball";
import CelebrationIcon from "@mui/icons-material/Celebration";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import { estonianSportsClubs } from "../../fakeData";
import ClassDetails from "./groups/ClassDetails";
import { useClub } from "../contexts/clubContext";
import MembersTable from "../Tables/MembersTable";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import SendTransactionCard from "../SendTransactionCard";
import BurnGlcCard from "../BurnGlcCard";

function ClubManagement() {
  const [clubMembers, setClubMembers] = useState();
  const [clubGroups, setClubGroups] = useState();
  const [value, setValue] = React.useState(0);
  const { clubs, updateUserRole, refreshClubs } = useClub();

  useEffect(() => {
    if (!clubs || clubs.length === 0) {
      console.log("No clubs loaded, refreshing clubs data...");
      refreshClubs();
    } else {
      setClubMembers(clubs[0].members || []);
      setClubGroups(clubs[0].groups || []);
      console.log("Club data loaded:", clubs[0]);
    }
  }, [clubs, refreshClubs]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleRoleChange = (memberId, role) => {
    updateUserRole(memberId, role, clubs[0].id);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Typography variant="h3" gutterBottom>
            {clubs.length > 0 ? clubs[0].name : "No club available"}
          </Typography>
        </Box>
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <img
            src={estonianSportsClubs[0].logo}
            alt={estonianSportsClubs[0].name}
            style={{ width: "100px" }}
          />
        </Box>
      </Box>
      <Box paddingTop="20px">
        <Typography variant="h5" gutterBottom>
          Club Summary
        </Typography>
        <Box display="flex" justifyContent="space-between">
          <BalanceCard address={clubs[0]?.club_stellar_wallet} />
          <BurnGlcCard></BurnGlcCard>
          <SendTransactionCard clubMembers={clubMembers ? clubMembers : []} />
        </Box>
      </Box>
      {/*userData.address && <AccountBalance myAddress={userData.address} />*/}
      <Box paddingTop="20px">
        <Typography variant="h5" gutterBottom>
          Course Managment
        </Typography>
        <ClassDetails clubGroups={clubGroups}></ClassDetails>
      </Box>

      <Box paddingTop="20px">
        <Typography variant="h5" gutterBottom>
          Member Managment
        </Typography>
        <Box display="flex" justifyContent="center" width="100%">
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            <Tab icon={<GroupWorkIcon />} label="All" />
            <Tab icon={<SportsIcon />} label="Coaches" />
            <Tab icon={<SportsHandballIcon />} label="Athletes" />
            <Tab icon={<CelebrationIcon />} label="Parents" />
            <Tab icon={<LockOpenIcon />} label="Owners" />
          </Tabs>
        </Box>
        <Box display="flex" justifyContent="center" width="100%">
          <MembersTable
            members={clubMembers}
            value={value}
            onRoleChange={handleRoleChange}
          />
        </Box>
      </Box>
    </>
  );
}

export default ClubManagement;