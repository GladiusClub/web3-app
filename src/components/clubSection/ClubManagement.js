import React, { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import Typography from "@mui/material/Typography";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  tableCellClasses,
} from "@mui/material";
import { useFirebase } from "../firebaseContext";
import { getDocs, collection } from "firebase/firestore";
//import { H1 } from "../styles/TextStyles";
//import AccountBalance from "../Balance";
import ShowNftCardButton from "../NftCard";
import Balance from "../BalanceCard";
import Box from "@mui/material/Box";
import { FakeMembers } from "../../fakeData";
import { styled } from "@mui/system";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SportsIcon from "@mui/icons-material/Sports";
import SportsHandballIcon from "@mui/icons-material/SportsHandball";
import CelebrationIcon from "@mui/icons-material/Celebration";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import { estonianSportsClubs } from "../../fakeData";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import IconButton from "@mui/material/IconButton";
import ClassDetails from "./GroupManagment";

function ClubManagement() {
  const { db } = useFirebase();
  const { userData } = useUser();
  const [members, setMembers] = useState(FakeMembers);
  const [value, setValue] = React.useState(0);
  const [images, setImages] = useState([]);

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

  const handleRoleChange = (event, memberId) => {
    // Change the data in the database
  };

  useEffect(() => {
    const fetchClubMembers = async () => {
      if (!userData || !userData.club) {
        return;
      }

      const membersCollection = collection(
        db,
        "club",
        userData.club,
        "members"
      );
      const membersSnapshot = await getDocs(membersCollection);
      const membersData = membersSnapshot.docs.map((doc) => doc.data());
      setMembers(membersData);
    };

    fetchClubMembers();
  }, [userData, db]);

  return (
    <>
      {/*userData ? <H1>{userData.club}!</H1> : null*/}
      {/*userData ? <p>Your club wallet address is {userData.address}!</p> : null*/}
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
            {estonianSportsClubs[0].name}
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
          <Balance />
          <Balance />
          <Balance />
        </Box>
      </Box>
      {/*userData.address && <AccountBalance myAddress={userData.address} />*/}
      <Box paddingTop="20px">
        <Typography variant="h5" gutterBottom>
          Class Managment
        </Typography>
        <ClassDetails></ClassDetails>
      </Box>

      <Box paddingTop="20px">
        <Typography variant="h5" gutterBottom>
          Club Members
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
          </Tabs>
        </Box>
        <Box display="flex" justifyContent="center" width="100%">
          <MembersTable
            members={members}
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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: "white",
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function RoleSelect({ member, onRoleChange }) {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleChange = (newRole) => {
    onRoleChange(member.id, newRole);
    setSelectedRole(null);
  };

  const openRoleChangeDialog = (role) => {
    setSelectedRole(role);
  };

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id={`member-role-label-${member.id}`}></InputLabel>
        <Select
          labelId={`member-role-label-${member.id}`}
          value={member.role}
          onChange={(event) => openRoleChangeDialog(event.target.value)}
        >
          <MenuItem value="Coach">Coach</MenuItem>
          <MenuItem value="Athlete">Athlete</MenuItem>
          <MenuItem value="Fan">Fan</MenuItem>
        </Select>
      </FormControl>
      <RoleChangeDialog
        open={selectedRole !== null}
        selectedRole={selectedRole}
        onClose={() => setSelectedRole(null)}
        onConfirm={handleRoleChange}
      />
    </>
  );
}

function RoleChangeDialog({ open, selectedRole, onClose, onConfirm }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Change Role?"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to change the member's role to {selectedRole}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => onConfirm(selectedRole)}
          color="primary"
          autoFocus
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function MemberRow({ member, onRoleChange }) {
  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {member.name}
      </TableCell>
      <TableCell>{member.gladiusCoins}</TableCell>
      <TableCell>{member.nftsEarned}</TableCell>
      <TableCell>
        <RoleSelect member={member} onRoleChange={onRoleChange} />
      </TableCell>
      <TableCell>
        <ShowNftCardButton member={member} />
      </TableCell>
    </TableRow>
  );
}

function MembersTable({ members, value, onRoleChange }) {
  return (
    <TableContainer component={Paper} sx={{ minWidth: 300, maxWidth: 800 }}>
      <Table aria-label="simple table">
        <TableHead
          sx={{
            background: "linear-gradient(45deg, #673ab7 30%, #3f51b5 90%)",
          }}
        >
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Gladius Coins</StyledTableCell>
            <StyledTableCell>NFTs Earned</StyledTableCell>
            <StyledTableCell>Role</StyledTableCell>
            <StyledTableCell>Transaction</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {members
            .filter((member) => {
              switch (value) {
                case 0:
                  return true;
                case 1:
                  return member.role === "Coach";
                case 2:
                  return member.role === "Athlete";
                case 3:
                  return member.role === "Fan";
                default:
                  return true;
              }
            })
            .map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                onRoleChange={onRoleChange}
              />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

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

