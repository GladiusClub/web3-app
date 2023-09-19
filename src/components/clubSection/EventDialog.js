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
//import useEventData from "../CustomHooks/useEventData";
import useSendTransaction from "../CustomHooks/useSendTransaction";
import { useRecordAttendance } from "../CustomHooks/useRecordAttendance";
import useMemberDetails from "../CustomHooks/useMemberDetails";
import useAutoSave from "../CustomHooks/useAutoSave";

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
  const { clubs } = useClub();
  const [memberChanges, setMemberChanges] = useState([]);
  const { handleSend, isTransactionLoading } = useSendTransaction();
  const [isTransferring, setIsTransferring] = useState(false);
  const { recordAttendanceForAllMembers } = useRecordAttendance();

  const resetStateVariables = useCallback(() => {
    setMemberChanges([]);
  }, []);

  const { loading, memberDetails, setMemberDetails, updateMemberDetails } =
    useMemberDetails(selectedEvent, open, googleCalendarId);

  useAutoSave({
    memberChanges,
    recordAttendanceForAllMembers,
    updateMemberDetails,
    resetStateVariables,
    googleCalendarId,
    selectedDate,
    selectedEvent,
  });

    
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

  const handleClose = () => {
    setOpen(false);
  };

  const recordAttendanceAndClose = async () => {
    await recordAttendanceForAllMembers({
      memberChanges,
      selectedEvent,
      googleCalendarId,
      selectedDate,
    });
    updateMemberDetails(memberChanges);
    resetStateVariables();
    handleClose();
  };

  useEffect(() => {
    if (isTransferring) {
      const membersToTransfer = memberDetails
        .filter(
          (member) =>
            member.attended === true &&
            (member.paid === undefined || member.paid === false)
        )
        .map((member) => ({
          address: member.address,
          amount: (member.coefficient || 1) * (member.score || 0),
        }))
        .filter((member) => member.amount > 0);

      const addressesToTransfer = membersToTransfer.map(
        (member) => member.address
      );
      const amountsToTransfer = membersToTransfer.map(
        (member) => member.amount
      );

      handleSend(addressesToTransfer, amountsToTransfer);

      setIsTransferring(false);
      //setOpen(false);
    }
  }, [memberDetails, isTransferring, setOpen, handleSend]);

  const handleTransferClick = async () => {
    await recordAttendanceForAllMembers({
      memberChanges,
      selectedEvent,
      googleCalendarId,
      selectedDate,
    });
    updateMemberDetails(memberChanges);
    resetStateVariables();
    setIsTransferring(true);
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
            isTransactionLoading={isTransactionLoading}
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
