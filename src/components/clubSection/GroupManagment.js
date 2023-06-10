import React, { useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Button, Dialog, DialogTitle, Box } from "@mui/material";
import CreateClassTable from "../Tables/CreateClassTable";
import EventsTable from "../Tables/EventsTable";
import ClassTable from "../Tables/ClassTable";
import Typography from "@mui/material/Typography";

export default function ClassDetails() {
  const [openDialog, setOpenDialog] = useState(false); // State for dialog visibility

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div>
      <Button
        color="secondary"
        variant="contained"
        sx={{ marginBottom: 2 }}
        onClick={handleOpenDialog}
      >
        Add Class +
      </Button>
      <ClassTable></ClassTable>
      <AddClassDialog open={openDialog} handleClose={handleCloseDialog} />
    </div>
  );
}

function AddClassDialog({ open, handleClose }) {
  const handleSubmit = () => {
    // Close the dialog
    handleClose();
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

const steps = [
  "Pick Class Name",
  "Add Members to Class",
  "Add Events to Class",
];

function HorizontalLinearStepper({ handleSubmit }) {
  const [activeStep, setActiveStep] = useState(0);
  const [className, setClassName] = useState("");
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  console.log(selectedEvents);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => {
      if (prevActiveStep === steps.length - 1) {
        handleSubmit();
      }
      const nextStep = prevActiveStep + 1;

      return nextStep;
    });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleClassNameChange = (event) => {
    setClassName(event.target.value);
  };

  const handleCheckboxChange = (event, member) => {
    const isChecked = event.target.checked;

    setSelectedMembers((prevSelectedMembers) => {
      if (isChecked) {
        return [...prevSelectedMembers, member];
      } else {
        return prevSelectedMembers.filter((m) => m !== member);
      }
    });
    console.log(selectedMembers);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div>
            <Typography>Class Name:</Typography>
            <input
              type="text"
              value={className}
              onChange={handleClassNameChange}
            />
          </div>
        );
      case 1:
        return (
          <div>
            <Typography>Members:</Typography>
            <CreateClassTable
              handleCheckboxChange={handleCheckboxChange}
            ></CreateClassTable>
          </div>
        );
      case 2:
        return (
          <div>
            <EventsTable setSelectedEvents={setSelectedEvents}></EventsTable>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      {activeStep < steps.length && (
        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <div>
            <Box sx={{ mt: 2 }}>{renderStepContent()}</Box>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleNext}>
                {activeStep >= steps.length - 1 ? "Submit" : "Next"}
              </Button>
            </Box>
          </div>
        </Box>
      )}
    </React.Fragment>
  );
}
