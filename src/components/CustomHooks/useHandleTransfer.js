import { useCallback } from "react";
import { useRecordAttendance } from "./useRecordAttendance";

const PaymentStatus = {
  PENDING: "payment pending",
  IN_PROGRESS: "payment in progress",
  FAILED: "payment failed",
  SUCCESS: "payment success",
};

function useHandleTransfer({
  memberDetails,
  membersToPay,
  handleSend,
  recordPayment,
  clubs,
  googleCalendarId,
  selectedEvent,
  setMemberDetails,
  setIsTransferring,
  isPaymentTableVisible,
  memberChanges,
  selectedDate,
  updateMemberDetails,
  resetStateVariables,
  setMembersToPay,
}) {
  const { recordAttendanceForAllMembers } = useRecordAttendance();

  const handleTransfer = useCallback(async () => {
    try {
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
            address: member.stellar_wallet,
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

        handleSend(addressesToTransfer, amountsToTransfer);

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
    } catch (error) {
      console.error("Error handling transfer: ", error);
    }
  }, [
    memberDetails,
    membersToPay,
    handleSend,
    recordPayment,
    clubs,
    googleCalendarId,
    selectedEvent,
    setMemberDetails,
    setIsTransferring,
    isPaymentTableVisible,
    memberChanges,
    selectedDate,
    updateMemberDetails,
    resetStateVariables,
    recordAttendanceForAllMembers,
    setMembersToPay,
  ]);

  return handleTransfer;
}

export default useHandleTransfer;
