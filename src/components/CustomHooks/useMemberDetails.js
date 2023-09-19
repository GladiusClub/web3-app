import { useState, useEffect } from "react";
import useEventData from "../CustomHooks/useEventData";

function useMemberDetails(selectedEvent, open, googleCalendarId) {
  const [loading, setLoading] = useState(true);
  const [memberDetails, setMemberDetails] = useState([]);

  const { memberDetails: fetchedMemberDetails } = useEventData(
    selectedEvent?.id,
    open,
    googleCalendarId,
    setLoading
  );

  useEffect(() => {
    setMemberDetails(fetchedMemberDetails);
  }, [fetchedMemberDetails]);

  const updateMemberDetails = (memberChanges) => {
    const updatedMembers = memberDetails.map((member) => {
      const change = memberChanges.find((change) => change.id === member.id);
      if (change) {
        return { ...member, ...change };
      }
      return member;
    });
    setMemberDetails(updatedMembers);
  };

  const resetMemberDetails = () => {
    setMemberDetails([]);
  };

  return {
    loading,
    memberDetails,
    setMemberDetails,
    updateMemberDetails,
    resetMemberDetails,
  };
}

export default useMemberDetails;
