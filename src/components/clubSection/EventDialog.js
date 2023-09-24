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
import useSendTransaction from "../CustomHooks/useSendTransaction";
import { useRecordAttendance } from "../CustomHooks/useRecordAttendance";
import useMemberDetails from "../CustomHooks/useMemberDetails";
import useAutoSave from "../CustomHooks/useAutoSave";
import PaymentTable from "../Tables/PaymentTable";

const PaymentStatus = {
  PENDING: "payment pending",
  IN_PROGRESS: "payment in progress",
  FAILED: "payment failed",
  SUCCESS: "payment success",
};

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
  const { clubs, recordPayment } = useClub();
  const [memberChanges, setMemberChanges] = useState([]);
  const { handleSend, isTransactionLoading } = useSendTransaction();
  const [isTransferring, setIsTransferring] = useState(false);
  const { recordAttendanceForAllMembers } = useRecordAttendance();
  const [isPaymentTableVisible, setIsPaymentTableVisible] = useState(false);
  const [membersToPay, setMembersToPay] = useState({});

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
    setIsPaymentTableVisible(false);
    setMembersToPay({});
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
      setIsPaymentTableVisible(true);
      setIsTransferring(false);
    }
  }, [memberDetails, isTransferring, setOpen, handleSend, membersToPay]); // Added membersToPay as a dependency

  const handleTransferClick = async () => {
    await recordAttendanceForAllMembers({
      memberChanges,
      selectedEvent,
      googleCalendarId,
      selectedDate,
    });
    updateMemberDetails(memberChanges);
    resetStateVariables();

    if (isPaymentTableVisible) {
      setMembersToPay((prevState) => {
        const updatedMembers = { ...prevState };
        for (const memberId in updatedMembers) {
          if (updatedMembers[memberId].toPay) {
            updatedMembers[memberId].status = PaymentStatus.IN_PROGRESS;
          }
        }
        return updatedMembers;
      });

      const membersToTransfer = memberDetails
        .filter(
          (member) =>
            member.attended === true &&
            membersToPay[member.id] && // Check if member id is in membersToPay
            !member.paid && // Simplified way to check if member is not paid
            membersToPay[member.id].toPay === true // Check if toPay is true in membersToPay
        )
        .map((member) => ({
          address: member.address,
          amount: membersToPay[member.id].payout || 0, // Grab the payout value from membersToPay
        }))
        .filter((member) => member.amount > 0);

      const addressesToTransfer = membersToTransfer.map(
        (member) => member.address
      );
      const amountsToTransfer = membersToTransfer.map(
        (member) => member.amount
      );

      console.log(addressesToTransfer, amountsToTransfer);

      // handleSend(addressesToTransfer, amountsToTransfer);

      setTimeout(() => {
        setMembersToPay((prevState) => {
          const updatedMembers = { ...membersToPay }; // Use the closed-over value
          const currentDate = new Date().toISOString(); // Get the current date
          for (const memberId in updatedMembers) {
            if (updatedMembers[memberId].toPay) {
              updatedMembers[memberId].status = PaymentStatus.SUCCESS;

              // Update the memberDetails state
              setMemberDetails((prevMemberDetails) => {
                return prevMemberDetails.map((member) => {
                  if (member.id === memberId) {
                    return {
                      ...member,
                      paid: currentDate, // Update the paid field to the current date
                    };
                  }
                  return member;
                });
              });

              recordPayment(
                clubs[0].id,
                memberId,
                googleCalendarId,
                selectedEvent?.id
              );
            }
          }
          return updatedMembers;
        });
      }, 5000);
    }

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
          {isPaymentTableVisible ? (
            <PaymentTable
              memberDetails={memberDetails}
              membersToPay={membersToPay}
              setMembersToPay={setMembersToPay}
            />
          ) : (
            <AttendanceTable
              groups={groups}
              memberDetails={memberDetails}
              handleMemberChanged={setMemberChanges}
              isTransactionLoading={isTransactionLoading}
            />
          )}
        </Box>
        <DialogActions>
          <Button onClick={recordAttendanceAndClose}>Close & Save</Button>
          {!isPaymentTableVisible ? (
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
          ) : isPaymentTableVisible &&
            (Object.keys(membersToPay).length === 0 ||
              Object.values(membersToPay).every(
                (member) => !member.toPay
              )) ? null : (
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
              Pay
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EventDialog;
