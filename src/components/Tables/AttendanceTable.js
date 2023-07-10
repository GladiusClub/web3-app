import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Checkbox,
  TextField,
} from "@mui/material";
import { useClub } from "../contexts/clubContext";

// This component represents a single row in the member table
function MemberRow({
  member,
  handleAttendanceChange,
  handleScoreChange,
  handleWinChange,
  handleCoefficientChange,
}) {
  const [isIntError, setIsIntError] = useState(false);
  const [score, setScore] = useState("");
  const [coefficient, setCoefficient] = useState("");
  const [win, setWin] = useState(false);

  const handleLocalScoreChange = (event) => {
    const val = event.target.value;

    if (val === "" || Number.isInteger(Number(val))) {
      setIsIntError(false);
    } else {
      setIsIntError(true);
    }
    setScore(val);
    handleScoreChange(member.id, val);
  };

  const handleLocalWinChange = (event) => {
    setWin(event.target.checked);
    handleWinChange(member.id, event.target.checked);
  };

  const handleLocalCoefficientChange = (event) => {
    const val = event.target.value;
    setCoefficient(val);
    handleCoefficientChange(member.id, val);
  };

  return (
    <TableRow key={member.name}>
      <TableCell>{member.name}</TableCell>
      <TableCell>
        <Checkbox
          checked={member.attendance}
          onChange={(event) => handleAttendanceChange(member.id, event)}
        />
      </TableCell>
      <TableCell>
        <Checkbox checked={win} onChange={handleLocalWinChange} />
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
          helperText={isIntError ? "Not an Integer." : ""}
          value={score}
          onChange={handleLocalScoreChange}
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
          value={coefficient}
          onChange={handleLocalCoefficientChange}
        />
      </TableCell>
    </TableRow>
  );
}

// This component represents the member table
function AttendanceTable({
  googleCalendarId,
  eventId,
  handleAttendanceChange,
  handleScoreChange,
  handleWinChange,
  handleCoefficientChange,
}) {


  const { clubs, getGroupsByEvent, getMemberAttendanceDetails } = useClub();
  const [filteredMembers, setFilteredMembers] = useState([]);

  useEffect(() => {
    if (clubs[0]) {
      const parentEventId = eventId.split("_")[0];
      getGroupsByEvent("1", googleCalendarId, parentEventId).then(
        async (matchingGroups) => {
          // Create a single array with all memberIds from all matching groups
          let allMemberIds = matchingGroups.flatMap((group) => group.memberIds);

          // Filter clubMembers based on the memberIds
          let membersInMatchingGroups = clubs[0].members.filter((member) =>
            allMemberIds.includes(member.id)
          );

          // Add attendance details to each member
          for (let member of membersInMatchingGroups) {
            const details = await getMemberAttendanceDetails(
              "1",
              member.id,
              googleCalendarId,
              eventId
            );
            member = { ...member, ...details };
            console.log("details", details);
          }

          setFilteredMembers(membersInMatchingGroups);
        }
      );
    }
  }, [
    clubs,
    eventId,
    googleCalendarId,
    getGroupsByEvent,
    getMemberAttendanceDetails,
  ]);

  useEffect(() => {
    console.log(filteredMembers);
  }, [filteredMembers]);



  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Attendance</TableCell>
          <TableCell>Win</TableCell>
          <TableCell>Scores</TableCell>
          <TableCell>Coefficient</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {filteredMembers.map((member) => (
          <MemberRow
            key={member.name}
            member={member}
            handleAttendanceChange={handleAttendanceChange}
            handleScoreChange={handleScoreChange}
            handleWinChange={handleWinChange}
            handleCoefficientChange={handleCoefficientChange}
          />
        ))}
      </TableBody>
    </Table>
  );
}

export default AttendanceTable;
