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
import useEventData from "../CustomHooks/useEventData";
import useSendTransaction from "../CustomHooks/useSendTransaction";

function EventDialog({
  open,
  setOpen,
  selectedDate,
  events,
  selectedEvent,
  setSelectedEvent,
  calendarRef,
  googleCalendarId,
}) {
  const { clubs, recordAttendance } = useClub();
  const [memberChanges, setMemberChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const { handleSend } = useSendTransaction();

  const { memberDetails: fetchedMemberDetails } = useEventData(
    selectedEvent?.id,
    open,
    googleCalendarId,
    setLoading
  );

  const [memberDetails, setMemberDetails] = useState(fetchedMemberDetails);

  const getCurrentEventGroups = () => {
    if (!selectedEvent || !googleCalendarId) return [];

    const currentEventId = selectedEvent.id.split("_")[0];

    return (
      clubs?.[0]?.groups
        ?.filter((group) =>
          group.event_ids?.some(
            (event) =>
              event.calendarId === googleCalendarId &&
              event.eventId === currentEventId
          )
        )
        ?.map((group) => ({
          id: group.id,
          name: group.name,
          members: group.member_uuids?.map((member) =>
            clubs[0].members.find((m) => m.id === member)
          ),
        })) || []
    );
  };

  const groups = getCurrentEventGroups();

  useEffect(() => {
    setMemberDetails(fetchedMemberDetails);
  }, [fetchedMemberDetails]);

  const updateLocalMemberDetails = useCallback(() => {
    const updatedMembers = memberDetails.map((member) => {
      const change = memberChanges.find((change) => change.id === member.id);
      if (change) {
        return { ...member, ...change };
      }
      return member;
    });
    setMemberDetails(updatedMembers);
  }, [memberDetails, memberChanges]);

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
        clubs[0].id,
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
    updateLocalMemberDetails();
    resetStateVariables();
  }, [
    selectedEvent,
    memberChanges,
    recordAttendance,
    selectedDate,
    resetStateVariables,
    updateLocalMemberDetails,
    googleCalendarId,
    clubs,
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

    const membersToTransfer = memberDetails
      .filter(
        (member) =>
          member.attended === true &&
          (member.paid === undefined || member.paid === false)
      )
      .map((member) => ({
        address: member.address,
        amount: (member.coefficient || 1) * (member.score || 0), // Ensuring that coefficient and score have fallback values
      }))
      .filter((member) => member.amount > 0); // Filtering out members with an amount of 0

    const addressesToTransfer = membersToTransfer.map(
      (member) => member.address
    );
    const amountsToTransfer = membersToTransfer.map((member) => member.amount);

    handleSend(addressesToTransfer, amountsToTransfer);
    setOpen(false); // Close the main dialog when transfer is closed
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleEventChange = (e) => {
    setMemberDetails([]);
    const eventId = e.target.value;
    const event = calendarRef.current.getApi().getEventById(eventId);
    setSelectedEvent(event);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <Box sx={{ p: 5 }}>
          <DialogTitle>
            Select Event for {selectedDate ? selectedDate : ""}
          </DialogTitle>
          <FormControl fullWidth>
            <Select
              value={selectedEvent ? selectedEvent.id : ""}
              onChange={handleEventChange}
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
            groups={groups}
            memberDetails={memberDetails}
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
            onClick={handleTransferClick}
          >
            Transfer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EventDialog;
