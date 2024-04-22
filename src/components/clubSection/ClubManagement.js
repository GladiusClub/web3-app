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
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import IconButton from "@mui/material/IconButton";
import ClassDetails from "./groups/ClassDetails";
import { useClub } from "../contexts/clubContext";
import MembersTable from "../Tables/MembersTable";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import SendTransactionCard from "../SendTransactionCard";

function ClubManagement() {
  const [clubMembers, setClubMembers] = useState();
  const [clubGroups, setClubGroups] = useState();
  const [value, setValue] = React.useState(0);
  const [images, setImages] = useState([]);
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

  useEffect(() => {
    async function loadImages() {
      const loadedImages = await Promise.all(
        Array.from({ length: 12 }, async (_, i) => {
          const img = await import(`../../img/gladius_samples/${i + 1}.jpg`);
          return img.default;
        })
      );
      setImages(loadedImages);
    }

    loadImages();
  }, []);

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
          <BalanceCard address={clubs[0]?.club_stellar_wallet || ""} />
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
            <Tab icon={<CelebrationIcon />} label="Fans" />
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
      <Box paddingTop="20px">
        <Typography variant="h5" gutterBottom>
          Club Inventory
        </Typography>
        <ImageGrid images={images} />
      </Box>
    </>
  );
}

export default ClubManagement;

const ImageGrid = ({ images }) => (
  <ImageList sx={{ width: 1000, height: 450 }} cols={4} gap={10}>
    {images.map((img, index) => (
      <ImageListItem key={index}>
        <img src={img} alt={`nft cat ${index}`} loading="lazy" />
        <ImageListItemBar
          title={`Image ${index + 1}`}
          subtitle={<span>by: author</span>}
          position="below"
          actionIcon={
            <IconButton
              aria-label={`info about Image ${index + 1}`}
              edge="end"
              sx={{ mr: 2 }}
            >
              <ArrowForwardIcon />
            </IconButton>
          }
        />
      </ImageListItem>
    ))}
  </ImageList>
);
