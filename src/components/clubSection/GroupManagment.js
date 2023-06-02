import React, { useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  tableCellClasses,
  Typography,
  Dialog,
  DialogTitle,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import CreateClassTable from "../Tables/CreateClassTable";

const classes = [
  { name: "Adult Soccer", size: 12 },
  { name: "Youth Basketball", size: 18 },
  { name: "Senior Swimming", size: 8 },
  { name: "Women's Volleyball", size: 15 },
  { name: "Men's Tennis", size: 10 },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: "white",
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default function ClassTable() {
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
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead
            sx={{
              background: "linear-gradient(45deg, #673ab7 30%, #3f51b5 90%)",
            }}
          >
            <TableRow>
              <StyledTableCell>Class</StyledTableCell>
              <StyledTableCell align="right">Students</StyledTableCell>
              <StyledTableCell align="right">Class Size</StyledTableCell>
              <StyledTableCell align="right">Events</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.map((item, index) => (
              <TableRow
                key={index}
                sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
              >
                <TableCell component="th" scope="row">
                  {item.name}
                </TableCell>
                <TableCell align="right">
                  <Button
                    startIcon={<ModeEditIcon />}
                    color="secondary"
                    variant="outlined"
                  >
                    Members
                  </Button>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="h6"
                    component="div"
                    color="secondary"
                    sx={{ fontWeight: "bold" }}
                  >
                    {item.size}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Button
                    startIcon={<ModeEditIcon />}
                    color="secondary"
                    variant="outlined"
                  >
                    Events
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
  const [events, setEvents] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

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

  const handleEventsChange = (event) => {
    setEvents(event.target.value);
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
            <Typography>Events:</Typography>
            <input type="text" value={events} onChange={handleEventsChange} />
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
