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
import useEventData from "../CustomHooks/useEventData";

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
  const [memberChanges, setMemberChanges] = useState([]);
  const [transferMode, setTransferMode] = useState(false);

  const { memberDetails, loading } = useEventData(selectedEvent?.id, open);

  const googleCalendarId = "dcromp88@googlemail.com";

  const resetStateVariables = useCallback(() => {
    setMemberChanges([]);
  }, []);

  const recordAttendanceForAllMembers = useCallback(async () => {
    const eventParentId = selectedEvent?.id.split("_")[0]; // Use optional chaining
    const eventId = selectedEvent?.id;

    for (let member of memberChanges) {
      const {
        id: memberId,
        attended,
        win: memberWin,
        score: memberScore,
        coefficient: memberCoefficient,
      } = member;

      await recordAttendance(
        "1",
        memberId,
        googleCalendarId,
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

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (memberChanges.length > 0) {
        recordAttendanceForAllMembers();
      }
    }, 5000); // Auto-save every 5 seconds

    return () => clearInterval(autoSaveInterval);
  }, [memberChanges, recordAttendanceForAllMembers]);

  const handleClose = () => {
    setOpen(false);
  };

  const recordAttendanceAndClose = async () => {
    await recordAttendanceForAllMembers();
    handleClose();
  };

  const handleTransferClick = async () => {
    await recordAttendanceForAllMembers();
    setTransferMode(true);
  };

  const handleCloseTransfer = () => {
    setTransferMode(false);
    setOpen(false); // Close the main dialog when transfer is closed
  };

  if (loading) {
    return <p>Loading...</p>;
  }

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
            filteredMembers={memberDetails}
            handleMemberChanged={setMemberChanges}
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
