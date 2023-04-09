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
import { H1 } from "../styles/TextStyles";
import AccountBalance from "../Balance";
import ShowNftCardButton from "../NftCard";
import Balance from "../BalanceCard";
import Box from "@mui/material/Box";
import { FakeMembers } from "../../fakeData";
import { styled } from "@mui/system";

function ClubDashboard() {
  const { db } = useFirebase();
  const { userData } = useUser();
  const [members, setMembers] = useState(FakeMembers);

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
      {userData ? <H1>{userData.club}!</H1> : null}
      {userData ? <p>Your club wallet address is {userData.address}!</p> : null}
      <Box display="flex" flexDirection="row">
        <Balance />
        {userData.address && <AccountBalance myAddress={userData.address} />}
      </Box>

      <Box display="flex" justifyContent="center" width="100%">
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
                <StyledTableCell>Edit</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.name}>
                  <TableCell component="th" scope="row">
                    {member.name}
                  </TableCell>
                  <TableCell>{member.gladiusCoins}</TableCell>
                  <TableCell>{member.nftsEarned}</TableCell>
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