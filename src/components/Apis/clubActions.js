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

      const memberIds = groupMembers.map((member) => member.id);
      const eventIds = groupEvents.map((event) => event.id);

      // Create a new document in groups collection with members as an empty array
      const docRef = await addDoc(groupsRef, {
        name: groupName,
        member_uuids: memberIds,
        event_ids: eventIds,
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

  return {
    updateUserRole,
    getAllGroupNames,
    createNewGroup,
  };
};
