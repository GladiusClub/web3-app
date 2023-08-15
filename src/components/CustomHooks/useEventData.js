import { useState, useEffect } from "react";
import { useClub } from "../contexts/clubContext";

function useEventData(eventId, open) {
  const [matchingGroups, setMatchingGroups] = useState([]);
  const [memberDetails, setMemberDetails] = useState([]);
  const { clubs, getGroupsByEvent, getMemberAttendanceDetails } = useClub();
  const googleCalendarId = "dcromp88@googlemail.com";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        if (clubs[0] && eventId) {
          const parentEventId = eventId.split("_")[0];

          const fetchedMatchingGroups = await getGroupsByEvent(
            "1",
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
            "1",
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
  }, [eventId, clubs, getGroupsByEvent, getMemberAttendanceDetails, open]);

  return { matchingGroups, memberDetails, loading };
}

export default useEventData;
