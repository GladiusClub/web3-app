import { useFirebase } from "../contexts/firebaseContext";
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
  query,
  where,
  setDoc,
  deleteDoc,
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
    date,
    eventParentId,
    eventId,
    attended,
    win = null,
    score = null,
    coefficient = null
  ) => {
    try {
      const docId = `${calendarId}_${eventId}`;

      // Get reference to attendance collection of a member in a club
      const attendanceRef = collection(
        db,
        `clubs/${clubId}/members/${userId}/attendance`
      );

      const docRef = doc(attendanceRef, docId);

      if (attended === false) {
        // Delete the document (only if attended is explicitly set to false)
        await deleteDoc(docRef);
        console.log("Attendance removed with ID: ", docRef.id);
      } else {
        // Set data for the document
        await setDoc(docRef, {
          calendarId,
          date,
          eventParentId,
          eventId,
          attended,
          win,
          score,
          coefficient,
        });
        console.log("Attendance recorded with ID: ", docRef.id);
      }

      // No need to update the local clubs state since attendance is not part of it
    } catch (error) {
      console.error("Error updating attendance: ", error);
    }
  };

  const getMemberAttendanceDetails = async (clubId, calendarId, eventId) => {
    try {
      // Get reference to members collection of a club
      const membersRef = collection(db, `clubs/${clubId}/members`);

      // Get all members in the club
      const memberSnapshots = await getDocs(membersRef);

      // Use Promise.all to make sure we have all the attendance data before returning the result
      const attendancePromises = memberSnapshots.docs.map(async (memberDoc) => {
        const memberId = memberDoc.id;

        // Get reference to attendance collection of a member
        const attendanceRef = collection(
          db,
          `clubs/${clubId}/members/${memberId}/attendance`
        );

        // Query the attendance collection for documents matching the specified calendarId and eventId
        const attendanceQuery = query(
          attendanceRef,
          where("calendarId", "==", calendarId),
          where("eventId", "==", eventId)
        );

        // Execute the query
        const attendanceSnapshot = await getDocs(attendanceQuery);

        // If the query returns a document, it means the member has an attendance record for the specified event
        if (!attendanceSnapshot.empty) {
          const attendanceDoc = attendanceSnapshot.docs[0]; // get the first document
          const attendanceData = attendanceDoc.data();

          // Return the member's attendance details
          return {
            id: memberId,
            attended: attendanceData.attended,
            win: attendanceData.win,
            score: attendanceData.score,
            coefficient: attendanceData.coefficient,
            paid: attendanceData.paid,
          };
        } else {
          return null;
        }
      });

      const memberAttendanceDetails = await Promise.all(attendancePromises);

      // Filter out null values from memberAttendanceDetails
      return memberAttendanceDetails.filter((member) => member !== null);
    } catch (error) {
      console.error("Error getting member attendance details: ", error);
    }
  };

  const getUserScoresByDate = async (clubId) => {
    try {
      // Get reference to members collection of a club
      const membersRef = collection(db, `clubs/${clubId}/members`);

      // Get all members in the club
      const memberSnapshots = await getDocs(membersRef);

      // Use Promise.all to make sure we have all the attendance data before returning the result
      const userScoresPromises = memberSnapshots.docs.map(async (memberDoc) => {
        const memberId = memberDoc.id;
        const memberData = memberDoc.data();
        const memberName = memberData.name;


        // Get reference to attendance collection of a member
        const attendanceRef = collection(
          db,
          `clubs/${clubId}/members/${memberId}/attendance`
        );

        // Get all attendance records of a member
        const attendanceSnapshots = await getDocs(attendanceRef);

        // Map each attendance record to an object containing the date (extracted from eventId) and the score
        const scoresByDate = attendanceSnapshots.docs.map((attendanceDoc) => {
          const attendanceData = attendanceDoc.data();
          const date = attendanceData.date;
          return {
            date,
            score: attendanceData.score,
          };
        });

        // Return an object containing the member id and their scores by date
        return {
          id: memberId,
          name: memberName,
          scoresByDate,
        };
      });

      const userScoresByDate = await Promise.all(userScoresPromises);

      return userScoresByDate;
    } catch (error) {
      console.error("Error getting user scores by date: ", error);
    }
  };

  return {
    updateUserRole,
    getAllGroupNames,
    createNewGroup,
    getGroupsByEvent,
    recordAttendance,
    getMemberAttendanceDetails,
    getUserScoresByDate,
  };
};
