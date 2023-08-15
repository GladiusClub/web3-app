import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Box,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import AttendanceTable from "../Tables/AttendanceTable";
import { useClub } from "../contexts/clubContext";
import TransferDialog from "./TransferDialog";

function EventDialog({
  open,
  setOpen,
  selectedDate,
  events,
  selectedEvent,
  setSelectedEvent,
  calendarRef,
}) {
  const { recordAttendance } = useClub();
  const [memberChanges, setmemberChanges] = useState([]);
  const [transferMode, setTransferMode] = useState(false);

  const resetStateVariables = useCallback(() => {
    setmemberChanges([]);
  }, []);

  const recordAttendanceForAllMembers = useCallback(async () => {
    const eventParentId = selectedEvent ? selectedEvent.id.split("_")[0] : null;
    const eventId = selectedEvent ? selectedEvent.id : null;

    for (let index in memberChanges) {
      const member = memberChanges[index];
      const memberId = member.id;
      const attended = member.attended;
      const memberWin = member.win;
      const memberScore = member.score;
      const memberCoefficient = member.coefficient;

      await recordAttendance(
        "1",
        memberId,
        "dcromp88@googlemail.com",
        selectedDate,
        eventParentId,
        eventId,
        attended,
        memberWin,
        memberScore,
        memberCoefficient
      );
    }
    resetStateVariables();
  }, [
    selectedEvent,
    memberChanges,
    recordAttendance,
    selectedDate,
    resetStateVariables,
  ]);

  const handleClose = () => {
    setOpen(false);
  };

  const recordAttendanceAndClose = async () => {
    await recordAttendanceForAllMembers();
    handleClose();
  };

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (memberChanges.length > 0) {
        recordAttendanceForAllMembers();
      }
    }, 5000); // Auto-save every 5 seconds

    return () => clearInterval(autoSaveInterval); // Clear the interval when the component unmounts
  }, [memberChanges, recordAttendanceForAllMembers]);

  useEffect(() => {
    console.log("Values to save: ", memberChanges);
  }, [memberChanges]);

  const handleTransferClick = async () => {
    await recordAttendanceForAllMembers();
    setTransferMode(true);
  };

  const handleCloseTransfer = () => {
    setTransferMode(false);
    setOpen(false); // Close the main dialog when transfer is closed
  };

  return (
    <div>
      <Dialog open={open && !transferMode} onClose={handleClose} maxWidth="md">
        <Box sx={{ p: 5 }}>
          <DialogTitle>
            Select Event for {selectedDate ? selectedDate : ""}
          </DialogTitle>
          <FormControl fullWidth>
            <Select
              value={selectedEvent ? selectedEvent.id : ""}
              onChange={(e) => {
                const eventId = e.target.value;
                const event = calendarRef.current
                  .getApi()
                  .getEventById(eventId);
                setSelectedEvent(event);
              }}
              sx={{ minWidth: 200, mb: 1 }}
            >
              {selectedDate &&
                events.map((event, index) => (
                  <MenuItem key={`${event.id}-${index}`} value={event.id}>
                    {event.title}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <AttendanceTable
            eventId={selectedEvent ? selectedEvent.id : null}
            googleCalendarId={"dcromp88@googlemail.com"}
            handleMemberChanged={setmemberChanges}
          ></AttendanceTable>
        </Box>
        <DialogActions>
          <Button onClick={recordAttendanceAndClose}>Close & Save</Button>
          <Button
            sx={{
              backgroundColor: "darkmagenta",
              color: "white",
              "&:hover": {
                backgroundColor: "purple",
              },
            }}
            onClick={handleTransferClick} //onClick={recordAttendanceAndClose}
          >
            Transfer
          </Button>
        </DialogActions>
      </Dialog>
      <TransferDialog
        open={open && transferMode}
        onClose={handleCloseTransfer}
      />
    </div>
  );
}

export default EventDialog;
