import React, { useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Button, Box, Typography, TextField } from "@mui/material";
import EventsTable from "../../Tables/EventsTable";

const steps = ["Pick Course Name", "Set Course Fees", "Add Events to Course"];

function HorizontalLinearStepper({ handleSubmit }) {
  const [activeStep, setActiveStep] = useState(0);
  const [className, setClassName] = useState("");
  const [subscriptionFee, setSubscriptionFee] = useState("");
  const [incentiveAmount, setIncentiveAmount] = useState("");
  const [selectedEvents, setSelectedEvents] = useState([]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => {
      if (prevActiveStep === steps.length - 1) {
        handleSubmit(
          className,
          subscriptionFee,
          incentiveAmount,
          selectedEvents
        );
      }
      return prevActiveStep + 1;
    });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleClassNameChange = (event) => {
    setClassName(event.target.value);
  };

  const handleSubscriptionFeeChange = (event) => {
    setSubscriptionFee(event.target.value);
  };

  const handleIncentiveAmountChange = (event) => {
    const newAmount = event.target.value;
    if (newAmount >= 0 && newAmount <= 100) {
      setIncentiveAmount(newAmount);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div>
            <Typography>Course Name:</Typography>
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
            <TextField
              type="number"
              value={subscriptionFee}
              onChange={handleSubscriptionFeeChange}
              variant="outlined"
              label="Subscription Fee"
            />
            <TextField
              type="number"
              value={incentiveAmount}
              onChange={handleIncentiveAmountChange}
              variant="outlined"
              label="Incentive Amount (%)"
              error={incentiveAmount < 0 || incentiveAmount > 100}
              helperText={
                incentiveAmount < 0 || incentiveAmount > 100
                  ? "Must be a percentage between 0 and 100"
                  : ""
              }
            />
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
                {activeStep === steps.length - 1 ? "Submit" : "Next"}
              </Button>
            </Box>
          </div>
        </Box>
      )}
    </React.Fragment>
  );
}

export default HorizontalLinearStepper;
