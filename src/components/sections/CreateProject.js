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

function CreateProject() {
  const { db } = useFirebase();

  const { address } = useUser();
  const club = "Tallinna Jalgpalliklubi";

  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchClubMembers = async () => {
      const membersCollection = collection(db, "club", club, "members");
      const membersSnapshot = await getDocs(membersCollection);
      const membersData = membersSnapshot.docs.map((doc) => doc.data());
      setMembers(membersData);
    };

    fetchClubMembers();
  }, [club, db]);

  return (
    <>
      {address ? <p>Your club wallet address is {address}!</p> : null}

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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default CreateProject;
