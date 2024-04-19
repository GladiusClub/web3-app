import { useFirebase } from "../contexts/firebaseContext";

import {
  doc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
  getDoc,
  query,
  where,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

export const useClubActions = (setClubs) => {
  const { db, auth } = useFirebase();

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
    const groups = [];

    // Get reference to groups collection of a club
    const groupsRef = collection(db, `clubs/${clubId}/groups`);

    // Get all groups in the club
    const groupSnapshots = await getDocs(groupsRef);

    // Iterate over each group and get the group id and name
    groupSnapshots.forEach((groupDoc) => {
      const groupData = groupDoc.data();
      groups.push({ id: groupDoc.id, name: groupData.name });
    });

    return groups;
  };

  const getGroupData = async (clubId, groupId) => {
    try {
      // Get reference to the specific group document in the groups collection of a club
      const groupDocRef = doc(db, `clubs/${clubId}/groups/${groupId}`);

      // Get the document
      const groupDoc = await getDoc(groupDocRef);

      // Check if the document exists
      if (groupDoc.exists()) {
        // Get the data from the document
        const groupData = groupDoc.data();

        console.log("Group data retrieved successfully:", groupData);

        // Return the data
        return groupData;
      } else {
        console.error("No such group found");
        return null;
      }
    } catch (error) {
      console.error("Error retrieving group data:", error);
      return null;
    }
  };

  const deleteGroupLocally = (clubId, groupId) => {
    setClubs((prevClubs) => {
      return prevClubs.map((club) => {
        if (club.id === clubId) {
          return {
            ...club,
            groups: club.groups.filter((group) => group.id !== groupId),
          };
        }
        return club;
      });
    });
  };

  const deleteGroup = async (clubId, groupId) => {
    try {
      // Get reference to the specific group document in the groups collection of a club
      const groupDocRef = doc(db, `clubs/${clubId}/groups/${groupId}`);

      // Delete the document
      await deleteDoc(groupDocRef);

      console.log("Group deleted successfully");
      deleteGroupLocally(clubId, groupId);
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  const updateGroupMembersLocally = (clubId, groupId, newMemberUUIDs) => {
    setClubs((prevClubs) => {
      return prevClubs.map((club) => {
        if (club.id === clubId) {
          return {
            ...club,
            groups: club.groups.map((group) => {
              if (group.id === groupId) {
                return {
                  ...group,
                  member_uuids: newMemberUUIDs,
                };
              }
              return group;
            }),
          };
        }
        return club;
      });
    });
  };

  const updateGroupMembers = async (clubId, groupId, newMemberUUIDs) => {
    try {
      // Get reference to the specific group document in the groups collection of a club
      const groupDocRef = doc(db, `clubs/${clubId}/groups/${groupId}`);

      // Update the member_uuids field in the document
      await updateDoc(groupDocRef, {
        member_uuids: newMemberUUIDs,
      });

      console.log("Group members updated successfully");
      updateGroupMembersLocally(clubId, groupId, newMemberUUIDs);
    } catch (error) {
      console.error("Error updating group members:", error);
    }
  };

  const createNewGroup = async (
    clubId,
    ownerId,
    groupName,
    subscriptionFee,
    incentiveAmount,
    groupEvents = []
  ) => {
    try {
      const idToken = await auth.currentUser.getIdToken(true);

      // Call external API first to ensure it succeeds before creating the Firestore document
      const apiResponse = await fetch(
        "https://europe-west1-wallet-login-45c1c.cloudfunctions.net/testSignupGladiusClubCourse",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ClubOwnerUID: ownerId,
            ClubUID: clubId,
            CourseName: groupName,
            CoursePrice: subscriptionFee,
            Courseincentive: incentiveAmount,
          }),
        }
      );

      const apiData = await apiResponse.json();
      console.log("Function response from API:", apiData);

      // Proceed only if the API call was successful
      if (!apiResponse.ok) {
        throw new Error("API call failed: " + apiData.message);
      }

      // Create a new document in the groups collection if the API call succeeds
      const groupsRef = collection(db, `clubs/${clubId}/groups`);
      const docRef = await addDoc(groupsRef, {
        name: groupName,
        subscriptionFee: subscriptionFee,
        incentiveAmount: incentiveAmount,
        event_ids: groupEvents,
        courseIndex: apiData.courseIndex, // Storing the course index from the API
        gladiusSubscriptionsId: apiData.gladius_subscriptions_id, // Storing the subscription ID from the API
      });

      console.log("Document written with ID: ", docRef.id);

      // Update the local clubs state
      setClubs((prevClubs) => {
        return prevClubs.map((club) => {
          if (club.id === clubId) {
            const existingGroups = club.groups || [];
            club.groups = [
              ...existingGroups,
              {
                id: docRef.id,
                name: groupName,
                subscriptionFee: subscriptionFee,
                incentiveAmount: incentiveAmount,
                event_ids: groupEvents,
                courseIndex: apiData.courseIndex,
                gladius_subscriptions_id: apiData.gladius_subscriptions_id,
              },
            ];
          }
          return club;
        });
      });

      return { newGroup: docRef.id, apiResponse: apiData };
    } catch (error) {
      console.error("Error in group creation or API call:", error);
      throw error; // Rethrow to handle the error externally if needed
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

        // Map each attendance record to an object containing the date (extracted from eventId), score, and win
        const scoresByDate = attendanceSnapshots.docs.map((attendanceDoc) => {
          const attendanceData = attendanceDoc.data();
          const date = attendanceData.date;
          return {
            date,
            score: attendanceData.score,
            win: attendanceData.win, // Add win property
          };
        });

        // Return an object containing the member id, name, and their scores by date
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

  const recordPayment = async (clubId, userId, calendarId, eventId) => {
    try {
      const docId = `${calendarId}_${eventId}`;

      // Get reference to attendance collection of a member in a club
      const attendanceRef = collection(
        db,
        `clubs/${clubId}/members/${userId}/attendance`
      );

      const docRef = doc(attendanceRef, docId);

      // Get the current date
      const currentDate = new Date().toISOString();

      // Update the paid date in the document
      await updateDoc(docRef, {
        paid: currentDate,
      });

      console.log(
        "Payment recorded with ID: ",
        docRef.id,
        " on date: ",
        currentDate
      );
    } catch (error) {
      console.error("Error updating payment: ", error);
    }
  };

  return {
    updateUserRole,
    getAllGroupNames,
    getGroupData,
    deleteGroup,
    updateGroupMembers,
    createNewGroup,
    getGroupsByEvent,
    recordAttendance,
    getMemberAttendanceDetails,
    getUserScoresByDate,
    recordPayment,
  };
};
