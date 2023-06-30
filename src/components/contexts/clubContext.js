import React, { createContext, useContext, useEffect, useState } from "react";
import { useFirebase } from "./firebaseContext";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";

const ClubContext = createContext();

export const useClub = () => {
  return useContext(ClubContext);
};

export const ClubProvider = ({ children }) => {
  const { auth, db } = useFirebase();
  const [clubs, setClubs] = useState([]);

  const updateUserRole = async (userId, role, clubId) => {
    try {
      const clubDocRef = doc(db, "clubs", clubId);
      const userDocRef = doc(db, clubDocRef, "users", userId);

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
    
      console.log(`User role updated successfully.`);
    } catch (error) {
      console.error(`Error updating user role: `, error);
    }
  };

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

                const memberCollectionRef = collection(clubDocRef, "users");
                const memberQuerySnapshot = await getDocs(memberCollectionRef);

                const memberDataPromises = memberQuerySnapshot.docs.map(
                  async (doc) => {
                    const memberData = doc.data();
                    return {
                      email: memberData.email,
                      name: memberData.name,
                      role: memberData.role,
                    };
                  }
                );

                const memberData = await Promise.all(memberDataPromises);

                clubData.members = memberData;

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

  return <ClubContext.Provider value={{ clubs, updateUserRole }}>{children}</ClubContext.Provider>;
};
