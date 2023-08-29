import { useState, useEffect } from "react";
import { useClub } from "../contexts/clubContext";

function useEventData(eventId, open, googleCalendarId, setLoading) {
  const [matchingGroups, setMatchingGroups] = useState([]);
  const [memberDetails, setMemberDetails] = useState([]);
  const { clubs, getGroupsByEvent, getMemberAttendanceDetails } = useClub();

  useEffect(() => {
    setMatchingGroups([]);
    setMemberDetails([]);
    setLoading(true);

    const fetchData = async () => {
      try {
        if (clubs[0] && eventId) {
          const parentEventId = eventId.split("_")[0];

          const fetchedMatchingGroups = await getGroupsByEvent(
            clubs[0].id,
            googleCalendarId,
            parentEventId
          );

          setMatchingGroups(fetchedMatchingGroups);

          const allMemberIds = fetchedMatchingGroups.flatMap(
            (group) => group.memberIds
          );
          const tempMembersInMatchingGroups = clubs[0].members.filter(
            (member) => allMemberIds.includes(member.id)
          );

          const fetchedMemberDetails = await getMemberAttendanceDetails(
            clubs[0].id,
            googleCalendarId,
            eventId
          );

          const tempFilteredMembers = tempMembersInMatchingGroups.map(
            (member) => {
              const details = fetchedMemberDetails.find(
                (detail) => detail.id === member.id
              );
              return { ...member, ...details };
            }
          );

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

  return { matchingGroups, memberDetails };
}

export default useEventData;
