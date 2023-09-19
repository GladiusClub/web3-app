import { useCallback } from "react";
import { useClub } from "../contexts/clubContext";

export function useRecordAttendance() {
  const { clubs, recordAttendance } = useClub();

  const recordAttendanceForAllMembers = useCallback(
    async (params) => {
      const { memberChanges, selectedEvent, googleCalendarId, selectedDate } =
        params;

      const eventParentId = selectedEvent?.id.split("_")[0];
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
    },
    [clubs, recordAttendance]
  );

  return { recordAttendanceForAllMembers };
}
