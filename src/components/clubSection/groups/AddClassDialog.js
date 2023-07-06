import React from "react";
import { Dialog, DialogTitle, Box } from "@mui/material";
import HorizontalLinearStepper from "./HorizontalLinearStepper";
import { useClub } from "../../contexts/clubContext";

function AddClassDialog({ open, handleClose }) {
  const { createNewGroup } = useClub();

  const handleSubmit = async (className, selectedMembers, selectedEvents) => {
    const clubId = "1";
    try {
      // Call the createGroup action.
      // Assumed structure of createGroup function: createGroup(clubId, groupName, members, events)
      // Close the dialog
      handleClose();
      await createNewGroup(clubId, className, selectedMembers, selectedEvents);
    } catch (error) {
      console.error(`Error creating group: `, error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Class</DialogTitle>
      <Box sx={{ margin: "16px" }}>
        <HorizontalLinearStepper handleSubmit={handleSubmit} />
      </Box>
    </Dialog>
  );
}

export default AddClassDialog;
