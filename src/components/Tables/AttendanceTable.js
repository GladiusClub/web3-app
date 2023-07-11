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
  const [attendance, setAttendance] = useState(member.attended || ""); //

  const [score, setScore] = useState(member.score || ""); // If member.score exists, use it as default, else use empty string
  const [coefficient, setCoefficient] = useState(member.coefficient || ""); // If member.coefficient exists, use it as default, else use empty string
  const [win, setWin] = useState(member.win || false); // If member.win exists, use it as default, else use false

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

  const handleLocalAttendanceChange = (event) => {
    setAttendance(event.target.checked);
    handleAttendanceChange(member.id, event);
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
          checked={attendance} // If member.attended exists, use it as default, else use false
          onChange={handleLocalAttendanceChange}
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
  const [membersInMatchingGroups, setMembersInMatchingGroups] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (clubs[0]) {
        try {
          const parentEventId = eventId.split("_")[0];

          const matchingGroups = await getGroupsByEvent(
            "1",
            googleCalendarId,
            parentEventId
          );

          let allMemberIds = matchingGroups.flatMap((group) => group.memberIds);

          const tempMembersInMatchingGroups = clubs[0].members.filter(
            (member) => allMemberIds.includes(member.id)
          );

          setMembersInMatchingGroups(tempMembersInMatchingGroups);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData();
  }, [clubs, eventId, googleCalendarId, getGroupsByEvent]);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      if (membersInMatchingGroups.length > 0) {
        try {
          const allMemberDetails = await getMemberAttendanceDetails(
            "1",
            googleCalendarId,
            eventId
          );

          const tempFilteredMembers = membersInMatchingGroups.map((member) => {
            const details = allMemberDetails.find(
              (detail) => detail.id === member.id
            );

            console.log(details); // Add this log
            return { ...member, ...details };
          });

          setFilteredMembers(tempFilteredMembers);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchMemberDetails();
  }, [
    membersInMatchingGroups,
    googleCalendarId,
    eventId,
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
