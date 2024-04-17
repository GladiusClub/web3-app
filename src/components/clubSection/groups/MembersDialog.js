import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import { useClub } from "../../contexts/clubContext";

const MembersDialog = ({ isOpen, handleClose, selectedGroup }) => {
  const { clubs, updateGroupMembers } = useClub();
  const [selectedMemberUUIDs, setSelectedMemberUUIDs] = useState([]);

  useEffect(() => {
    if (clubs.length > 0 && selectedGroup) {
      const group = clubs[0].groups.find(
        (group) => group.id === selectedGroup.id
      );
      const groupMembers = group?.member_uuids || [];
      setSelectedMemberUUIDs(groupMembers);
    }
  }, [clubs, selectedGroup]);

  const handleToggleMemberSelection = (memberId) => {
    setSelectedMemberUUIDs((prevState) => {
      if (prevState.includes(memberId)) {
        return prevState.filter((id) => id !== memberId);
      } else {
        return [...prevState, memberId];
      }
    });
  };

  const handleSave = async () => {
    console.log("Save button clicked");
    const groupId = selectedGroup?.id;
    if (clubs.length > 0 && groupId) {
      try {
        await updateGroupMembers(clubs[0].id, groupId, selectedMemberUUIDs);
        console.log("Group members updated successfully");
      } catch (error) {
        console.error("Error updating group members:", error);
      }
    }
    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Add/Remove Members</DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell padding="checkbox">Add/Remove</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clubs.length > 0 &&
                clubs[0].members.map((member, index) => {
                  const isMemberInGroup = selectedMemberUUIDs.includes(
                    member.id
                  );
                  return (
                    <TableRow key={index}>
                      <TableCell>{member.name}</TableCell>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isMemberInGroup}
                          onChange={() =>
                            handleToggleMemberSelection(member.id)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSave}
          style={{ marginTop: "16px" }}
        >
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default MembersDialog;
