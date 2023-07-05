import React, { useState, useEffect } from "react";
import { Table, TableBody, TableRow, TableCell, Checkbox } from "@mui/material";
import { useClub } from "../contexts/clubContext";

// This component represents a single row in the member table
function MemberRow({ member, handleCheckboxChange }) {
  return (
    <TableRow key={member.name}>
      <TableCell>{member.name}</TableCell>
      <TableCell>
        <Checkbox
          checked={member.attendance}
          onChange={(event) => handleCheckboxChange(event, member)}
        />
      </TableCell>
    </TableRow>
  );
}

// This component represents the member table
function CreateClassTable({ handleCheckboxChange }) {
  const { clubs } = useClub();
  const [clubMembers, setClubMembers] = useState();

  useEffect(() => {
    if (clubs[0]) {
      setClubMembers(clubs[0].members);
    }
  }, [clubs]);

  return (
    <Table>
      <TableBody>
        {clubMembers &&
          clubMembers.map((member) => (
            <MemberRow
              key={member.name}
              member={member}
              handleCheckboxChange={handleCheckboxChange}
            />
          ))}
      </TableBody>
    </Table>
  );
}

export default CreateClassTable;
