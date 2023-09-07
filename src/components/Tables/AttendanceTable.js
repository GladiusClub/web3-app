import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Checkbox,
  TextField,
  Collapse,
} from "@mui/material";

// This component represents a single row in the member table
function MemberRow({ member, handleMemberChanged }) {
  const [isIntError, setIsIntError] = useState(false);
  const [attended, setAttended] = useState(member.attended || false); //

  const [score, setScore] = useState(member.score || ""); // If member.score exists, use it as default, else use empty string
  const [coefficient, setCoefficient] = useState(member.coefficient || ""); // If member.coefficient exists, use it as default, else use empty string
  const [win, setWin] = useState(member.win || false); // If member.win exists, use it as default, else use false

  const handleLocalScoreChange = (event) => {
    const val = event.target.value;
    setScore(val);
    if (val === "" || Number.isInteger(Number(val))) {
      setIsIntError(false);
    } else {
      setIsIntError(true);
    }
    handleMemberChanged((prev) => {
      const existingMemberIndex = prev.findIndex((m) => m.id === member.id);

      if (existingMemberIndex !== -1) {
        // Update the score property of the existing member with the new value
        const updatedMember = { ...prev[existingMemberIndex], score: val };
        const updatedMembers = [...prev];
        updatedMembers[existingMemberIndex] = updatedMember;
        return updatedMembers;
      } else {
        // Add the member to the state if it doesn't exist
        return [...prev, { ...member, score: val }];
      }
    });
  };

  const handleLocalAttendanceChange = (event) => {
    const newAttendedValue = event.target.checked;
    setAttended(newAttendedValue);
    handleMemberChanged((prev) => {
      const existingMemberIndex = prev.findIndex((m) => m.id === member.id);

      if (existingMemberIndex !== -1) {
        // Update the attendance property of the existing member with the new value
        const updatedMember = {
          ...prev[existingMemberIndex],
          attended: newAttendedValue,
        };
        const updatedMembers = [...prev];
        updatedMembers[existingMemberIndex] = updatedMember;
        return updatedMembers;
      } else {
        // Add the member to the state if it doesn't exist
        return [...prev, { ...member, attended: newAttendedValue }];
      }
    });
  };

  const handleLocalCoefficientChange = (event) => {
    const val = event.target.value;
    setCoefficient(val);
    handleMemberChanged((prev) => {
      const existingMemberIndex = prev.findIndex((m) => m.id === member.id);

      if (existingMemberIndex !== -1) {
        // Update the coefficient property of the existing member with the new value
        const updatedMember = {
          ...prev[existingMemberIndex],
          coefficient: val,
        };
        const updatedMembers = [...prev];
        updatedMembers[existingMemberIndex] = updatedMember;
        return updatedMembers;
      } else {
        // Add the member to the state if it doesn't exist
        return [...prev, { ...member, coefficient: val }];
      }
    });
  };

  const handleLocalWinChange = (event) => {
    const newWinValue = event.target.checked;
    setWin(newWinValue);
    handleMemberChanged((prev) => {
      const existingMemberIndex = prev.findIndex((m) => m.id === member.id);

      if (existingMemberIndex !== -1) {
        // Update the win property of the existing member with the new value
        const updatedMember = {
          ...prev[existingMemberIndex],
          win: newWinValue,
        };
        const updatedMembers = [...prev];
        updatedMembers[existingMemberIndex] = updatedMember;
        return updatedMembers;
      } else {
        // Add the member to the state if it doesn't exist
        return [...prev, { ...member, win: newWinValue }];
      }
    });
  };

  return (
    <TableRow key={member.name}>
      <TableCell>{member.name}</TableCell>
      <TableCell>
        <Checkbox
          checked={attended} // If member.attended exists, use it as default, else use false
          onChange={handleLocalAttendanceChange}
        />
      </TableCell>
      <TableCell>
        <Checkbox
          checked={win}
          onChange={handleLocalWinChange}
          disabled={!attended}
        />
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
          disabled={!attended}
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
          disabled={!attended}
        />
      </TableCell>
    </TableRow>
  );
}

function GroupRow({ group, memberDetails, handleMemberChanged }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded((prev) => !prev);
  };

  // Get the additional details for each member in the group
  const detailedMembers = group.members.map((groupMember) => {
    const memberDetail = memberDetails.find(
      (detail) => detail.id === groupMember.id
    );
    return {
      ...groupMember,
      ...memberDetail,
    };
  });

  return (
    <>
      <TableRow onClick={toggleExpansion}>
        <TableCell>
          {isExpanded ? "▼" : "►"} {group.name}
        </TableCell>
        {/* Add other cells for group details here */}
      </TableRow>
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Table size="small" aria-label="purchases">
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
            {detailedMembers ? (
              detailedMembers.map((member) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  handleMemberChanged={handleMemberChanged}
                />
              ))
            ) : (
              <TableRow>
                <TableCell>Loading...</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Collapse>
    </>
  );
}

function AttendanceTable({ groups, memberDetails, handleMemberChanged }) {
  const [isWholeClubExpanded, setIsWholeClubExpanded] = useState(false);

  const toggleWholeClubExpansion = () => {
    setIsWholeClubExpanded((prev) => !prev);
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Group</TableCell>
          {/*<TableCell>Attendance</TableCell>
          <TableCell>Win</TableCell>
          <TableCell>Scores</TableCell>
          <TableCell>Coefficient</TableCell>*/}
        </TableRow>
      </TableHead>
      <TableBody>
      {groups.map((group) => (
          <GroupRow
            key={group.id}
            group={group}
            memberDetails={memberDetails}
            handleMemberChanged={handleMemberChanged}
          />
        ))}
        {/* Whole Club Section */}
        <TableRow onClick={toggleWholeClubExpansion}>
          <TableCell>{isWholeClubExpanded ? "▼" : "►"} Whole Club</TableCell>
          {/* Other cells for "Whole Club" row */}
        </TableRow>
        <Collapse in={isWholeClubExpanded} timeout="auto" unmountOnExit>
          {memberDetails.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              handleMemberChanged={handleMemberChanged}
            />
          ))}
        </Collapse>
      </TableBody>
    </Table>
  );
}

export default AttendanceTable;

