import React from "react";
import { Dialog, DialogTitle, Box } from "@mui/material";
import HorizontalLinearStepper from "./HorizontalLinearStepper";
import { useClub } from "../../contexts/clubContext";

function AddClassDialog({ open, handleClose }) {
  const { clubs, createNewGroup } = useClub();

  const handleSubmit = async (
    className,
    subscriptionFee,
    incentiveAmount,
    selectedEvents
  ) => {
    const clubId = clubs[0].id;
    const ownerId = clubs[0].members[0].id;
    try {
      // Call the createGroup action.
      // Assumed structure of createGroup function: createGroup(clubId, groupName, subscriptionFee, incentiveAmount)
      // Close the dialog
      handleClose();
      await createNewGroup(
        clubId,
        ownerId,
        className,
        subscriptionFee,
        incentiveAmount,
        selectedEvents
      );
    } catch (error) {
      console.error(`Error creating group: `, error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Course</DialogTitle>
      <Box sx={{ margin: "16px" }}>
        <HorizontalLinearStepper handleSubmit={handleSubmit} />
      </Box>
    </Dialog>
  );
}

export default AddClassDialog;
