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
  const [attended, setAttended] = useState(member.attended || false);

  const [score, setScore] = useState(member.score || "");
  const [coefficient, setCoefficient] = useState(member.coefficient || 1.0);
  const [win, setWin] = useState(member.win || false);

  const payout = score !== "" && !isIntError ? score * coefficient : "";

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
      <TableCell>{payout}</TableCell>
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

  console.log("detailedMembers", detailedMembers);

  return (
    <>
      <TableRow onClick={toggleExpansion}>
        <TableCell colSpan={6}>
          {isExpanded ? "▼" : "►"} {group.name}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Attendance</TableCell>
                  <TableCell>Win</TableCell>
                  <TableCell>Scores</TableCell>
                  <TableCell>Coefficient</TableCell>
                  <TableCell>Payout</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {detailedMembers.map((member) => (
                  <MemberRow
                    key={member.id}
                    member={member}
                    handleMemberChanged={handleMemberChanged}
                  />
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function AttendanceTable({
  groups,
  memberDetails,
  handleMemberChanged,
  isTransactionLoading,
}) {
  const updateMemberDetailsWithCourseIndex = (groups, memberDetails) => {
    groups.forEach((group) => {
      group.members.forEach((groupMember) => {
        const memberDetail = memberDetails.find(
          (detail) => detail.id === groupMember.id
        );
        if (memberDetail) {
          if (!memberDetail.courseIndex) {
            memberDetail.courseIndex = [];
          }
          if (!memberDetail.courseIndex.includes(group.courseIndex)) {
            memberDetail.courseIndex.push(group.courseIndex);
          }
        }
      });
    });
  };

  // Update memberDetails array with course indices from each group
  updateMemberDetailsWithCourseIndex(groups, memberDetails);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Group</TableCell>
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
      </TableBody>
    </Table>
  );
}

export default AttendanceTable;

