import { useFirebase } from "../contexts/firebaseContext";
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore";

export const useClubActions = (setClubs) => {
  const { db } = useFirebase();

  const updateUserRole = async (userId, role, clubId) => {
    console.log("Updating role", userId, role, clubId);
    try {
      const userDocRef = doc(db, `clubs/${clubId}/members/${userId}`);

      // Update 'role' field of the user document
      await updateDoc(userDocRef, {
        role: role,
      });

      // Also update the local clubs state
      setClubs((prevClubs) => {
        return prevClubs.map((club) => {
          if (club.id === clubId) {
            club.members = club.members.map((member) => {
              if (member.id === userId) {
                member.role = role;
              }
              return member;
            });
          }
          return club;
        });
      });

      console.log(`User member updated successfully.`);
    } catch (error) {
      console.error(`Error updating member role: `, error);
    }
  };

  const getAllGroupNames = async (clubId) => {
    const groupNames = [];

    // Get reference to groups collection of a club
    const groupsRef = collection(db, `clubs/${clubId}/groups`);

    // Get all groups in the club
    const groupSnapshots = await getDocs(groupsRef);

    // Iterate over each group and get the group name
    groupSnapshots.forEach((groupDoc) => {
      groupNames.push(groupDoc.data().name);
    });

    return groupNames;
  };

  const createNewGroup = async (
    clubId,
    groupName,
    groupMembers = [],
    groupEvents = []
  ) => {
    try {
      // Get reference to groups collection of a club
      const groupsRef = collection(db, `clubs/${clubId}/groups`);
      console.log(groupEvents);

      const memberIds = groupMembers.map((member) => member.id);

      // Create a new document in groups collection with members as an empty array
      const docRef = await addDoc(groupsRef, {
        name: groupName,
        member_uuids: memberIds,
        event_ids: groupEvents,
      });

      console.log("Document written with ID: ", docRef.id);

      // Also update the local clubs state
      setClubs((prevClubs) => {
        return prevClubs.map((club) => {
          if (club.id === clubId) {
            const existingGroups = club.groups || [];
            club.groups = [
              ...existingGroups,
              {
                id: docRef.id,
                name: groupName,
                member_uuids: [],
                event_ids: [],
              },
            ];
          }
          return club;
        });
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const getGroupsByEvent = async (clubId, calendarId, eventId) => {
    // Define an array to store matching group and member IDs
    let matchingGroups = [];
  
    try {
      // Get reference to groups collection of a club
      const groupsRef = collection(db, `clubs/${clubId}/groups`);

      // Get all groups in the club
      const groupSnapshots = await getDocs(groupsRef);

      // Iterate over each group and check for matching calendar and event IDs
      groupSnapshots.forEach((groupDoc) => {
        const groupData = groupDoc.data();

        // Check if event_ids field exists and is an array, then check if it includes the target eventId and calendarId
        const hasMatchingEvent =
          groupData.event_ids &&
          Array.isArray(groupData.event_ids) &&
          groupData.event_ids.some((event) => {
            return event.calendarId === calendarId && event.eventId === eventId;
          });

        if (hasMatchingEvent) {
          // If a match is found, add the group and member IDs to the matchingGroups array
          matchingGroups.push({
            groupId: groupDoc.id,
            memberIds: groupData.member_uuids,
          });
        }
      });
    } catch (error) {
      console.error("Error getting groups: ", error);
    }
  
    return matchingGroups;
  };

  const recordAttendance = async (
    clubId,
    userId,
    calendarId,
    eventId,
    attended,
    score
  ) => {
    try {
      // Get reference to attendance collection of a member in a club
      const attendanceRef = collection(
        db,
        `clubs/${clubId}/members/${userId}/attendance`
      );

      // Create a new document in attendance collection
      const docRef = await addDoc(attendanceRef, {
        calendarId,
        eventId,
        date: new Date(), // current date and time
        attended,
        score,
      });

      console.log("Attendance recorded with ID: ", docRef.id);

      // No need to update the local clubs state since attendance is not part of it
    } catch (error) {
      console.error("Error recording attendance: ", error);
    }
  };

  return {
    updateUserRole,
    getAllGroupNames,
    createNewGroup,
    getGroupsByEvent,
    recordAttendance,
  };
};
