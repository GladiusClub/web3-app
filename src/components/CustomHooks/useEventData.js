import { useState, useEffect } from "react";
import { useClub } from "../contexts/clubContext";

function useEventData(eventId, open, googleCalendarId, setLoading) {
  const [memberDetails, setMemberDetails] = useState([]);
  const { clubs, getGroupsByEvent, getMemberAttendanceDetails } = useClub();

  useEffect(() => {
    setMemberDetails([]);
    setLoading(true);

    const fetchData = async () => {
      try {
        if (clubs[0] && eventId) {
          // Fetching member attendance details
          const fetchedMemberDetails = await getMemberAttendanceDetails(
            clubs[0].id,
            googleCalendarId,
            eventId
          );

          // Merging member attendance details with all members, instead of filtering based on matching groups
          const tempFilteredMembers = clubs[0].members
            .map((member) => {
              const details = fetchedMemberDetails.find(
                (detail) => detail.id === member.id
              );
              return { ...member, ...details };
            })
            .filter((member) => member.role !== "owner"); // Filtering out members with the role 'owner'
          setMemberDetails(tempFilteredMembers);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [
    eventId,
    clubs,
    getGroupsByEvent,
    getMemberAttendanceDetails,
    open,
    googleCalendarId,
    setLoading,
  ]);

  return { memberDetails };
}

export default useEventData;
