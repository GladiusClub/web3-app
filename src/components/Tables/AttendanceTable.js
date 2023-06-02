import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Checkbox,
  TextField,
} from "@mui/material";
import { FakeMembers } from "../../fakeData";

// This component represents a single row in the member table
function MemberRow({ member, handleCheckboxChange }) {
  const [intVal, setIntVal] = useState("");
  const [isIntError, setIsIntError] = useState(false);

  const handleIntChange = (event) => {
    const val = event.target.value;

    if (val === "" || Number.isInteger(Number(val))) {
      setIsIntError(false);
    } else {
      setIsIntError(true);
    }

    setIntVal(val);
  };

  return (
    <TableRow key={member.name}>
      <TableCell>{member.name}</TableCell>
      <TableCell>
        <Checkbox
          checked={member.attendance}
          onChange={(event) => handleCheckboxChange(event, member)}
        />
      </TableCell>
      <TableCell>
        <Checkbox />
      </TableCell>
      <TableCell>
        <TextField
          type="number"
          inputProps={{
            step: 1,
            min: 0,
          }}
          placeholder="Enter an integer"
          error={isIntError}
          value={intVal}
          onChange={handleIntChange}
          helperText={isIntError ? "Not an Integer." : ""}
        />
      </TableCell>
      <TableCell>
        <TextField
          type="number"
          inputProps={{
            step: 0.01,
            min: 0,
          }}
          placeholder="Enter a float"
        />
      </TableCell>
    </TableRow>
  );
}

// This component represents the member table
function AttendanceTable({ handleCheckboxChange }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Attendance</TableCell>
          <TableCell>Win</TableCell>
          <TableCell>Scores</TableCell>
          <TableCell>Coefficent</TableCell>
        </TableRow>
      </TableHead>
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

export default AttendanceTable;
