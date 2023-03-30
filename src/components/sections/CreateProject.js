import React, { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useFirebase } from "../firebaseContext";
import { getDocs, collection } from "firebase/firestore";
import { H1 } from "../styles/TextStyles";
import AccountBalance from "../Balance";
import SendNFTButton from "../SendNft";

function CreateProject() {
  const { db } = useFirebase();
  const { userData } = useUser();
  const [members, setMembers] = useState([]);

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
      {userData.address ? (
        <AccountBalance myAddress={userData.address}></AccountBalance>
      ) : null}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.name}>
                <TableCell component="th" scope="row">
                  {member.name}
                </TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.address}</TableCell>
                <TableCell>
                  <SendNFTButton member={member}></SendNFTButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default CreateProject;
