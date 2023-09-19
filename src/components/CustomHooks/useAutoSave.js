import { useEffect, useCallback } from "react";

function useAutoSave({
  memberChanges,
  recordAttendanceForAllMembers,
  updateMemberDetails,
  resetStateVariables,
  googleCalendarId,
  selectedDate,
  selectedEvent,
  interval = 5000,
}) {
  const resetStateVariablesCallback = useCallback(() => {
    resetStateVariables();
  }, [resetStateVariables]);

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (memberChanges.length > 0) {
        recordAttendanceForAllMembers({
          memberChanges,
          selectedEvent,
          googleCalendarId,
          selectedDate,
        });
        updateMemberDetails(memberChanges);
        resetStateVariablesCallback();
      }
    }, interval); // Auto-save every 5 seconds by default

    return () => clearInterval(autoSaveInterval);
  }, [
    memberChanges,
    recordAttendanceForAllMembers,
    updateMemberDetails,
    resetStateVariablesCallback,
    googleCalendarId,
    selectedDate,
    selectedEvent,
    interval,
  ]);
}

export default useAutoSave;
