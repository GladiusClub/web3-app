import React, { createContext, useContext, useEffect, useState } from "react";
import { useFirebase } from "./firebaseContext";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { useClubActions } from "../Apis/clubActions";

const ClubContext = createContext();

export const useClub = () => {
  return useContext(ClubContext);
};

export const ClubProvider = ({ children }) => {
  const { auth, db } = useFirebase();
  const [clubs, setClubs] = useState([]);
  const clubActions = useClubActions(setClubs);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userCredential) => {
      if (userCredential) {
        const uid = userCredential.uid;
        const userDocRef = doc(db, "users", uid);
        getDoc(userDocRef).then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();

            const memberClubIds = userData.clubs_roles.map(
              (club) => club.club_id
            );

            Promise.all(
              memberClubIds.map(async (clubId) => {
                const clubDocRef = doc(db, "clubs", clubId);
                const clubSnap = await getDoc(clubDocRef);
                const clubData = clubSnap.data();
                clubData.id = clubId;

                const memberCollectionRef = collection(clubDocRef, "members");
                const memberQuerySnapshot = await getDocs(memberCollectionRef);

                const memberDataPromises = memberQuerySnapshot.docs.map(
                  async (doc) => {
                    const memberData = doc.data();
                    return {
                      id: doc.id,
                      email: memberData.email,
                      name: memberData.name,
                      role: memberData.role,
                    };
                  }
                );

                const memberData = await Promise.all(memberDataPromises);
                clubData.members = memberData;

                // Add this section to fetch groups data
                const groupsCollectionRef = collection(clubDocRef, "groups");
                const groupsQuerySnapshot = await getDocs(groupsCollectionRef);

                const groupsDataPromises = groupsQuerySnapshot.docs.map(
                  async (doc) => {
                    const groupData = doc.data();
                    return {
                      id: doc.id,
                      name: groupData.name,
                      member_uuids: groupData.member_uuids || [],
                      event_ids: groupData.event_ids || [],
                    };
                  }
                );

                const groupsData = await Promise.all(groupsDataPromises);
                clubData.groups = groupsData;

                return clubData;
              })
            ).then((clubsData) => {
              setClubs(clubsData);
            });
          }
        });
      } else {
        setClubs([]);
      }
    });

    // Clean up the onAuthStateChanged listener
    return unsubscribe;
  }, [db, auth]);

  return (
    <ClubContext.Provider value={{ clubs, ...clubActions }}>
      {children}
    </ClubContext.Provider>
  );
};
