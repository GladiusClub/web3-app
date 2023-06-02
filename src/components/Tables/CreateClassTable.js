import React from "react";
import { Table, TableBody, TableRow, TableCell, Checkbox } from "@mui/material";
import { FakeMembers } from "../../fakeData";

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
  return (
    <Table>
      <TableBody>
        {FakeMembers.map((member) => (
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
