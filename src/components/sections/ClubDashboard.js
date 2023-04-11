import React, { useState, useEffect } from "react";
import { useUser } from "../UserContext";
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
import AccountBalance from "../Balance";
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

function ClubDashboard() {
  const { db } = useFirebase();
  const { userData } = useUser();
  const [members, setMembers] = useState(FakeMembers);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
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
      <Box display="flex" flexDirection="row">
        <Balance />
        {userData.address && <AccountBalance myAddress={userData.address} />}
      </Box>

      <Box display="flex" justifyContent="center" width="100%">
        <TableContainer component={Paper} sx={{ minWidth: 300, maxWidth: 800 }}>
          <Box display="flex" justifyContent="center" width="100%" mb={2}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="icon label tabs example"
            >
              <Tab icon={<GroupWorkIcon />} label="ALL" />
              <Tab icon={<SportsIcon />} label="COACHES" />
              <Tab icon={<SportsHandballIcon />} label="ATHLETES" />
              <Tab icon={<CelebrationIcon />} label="FANS" />
            </Tabs>
          </Box>
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
                  <TableRow key={member.name}>
                    <TableCell component="th" scope="row">
                      {member.name}
                    </TableCell>
                    <TableCell>{member.gladiusCoins}</TableCell>
                    <TableCell>{member.nftsEarned}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>
                      <ShowNftCardButton member={member}></ShowNftCardButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default ClubDashboard;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: "white",
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));