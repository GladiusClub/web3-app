import React, { createContext, useContext, useEffect, useState } from "react";
import { useFirebase } from "./firebaseContext";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const ClubContext = createContext();

export const useClub = () => {
  return useContext(ClubContext);
};

export const ClubProvider = ({ children }) => {
  const { auth, db } = useFirebase();
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userCredential) => {
      if (userCredential) {
        const uid = userCredential.uid;
        const userDocRef = doc(db, "users", uid);
        getDoc(userDocRef).then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            const ownerClubIds = userData.owner;

            // Retrieve club data for each club in ownerClubs
            const clubPromises = ownerClubIds.map((clubId) =>
              getDoc(doc(db, "clubs", String(clubId)))
            );

            Promise.all(clubPromises).then((clubSnapshots) => {
              const clubsData = clubSnapshots.map((snap) => {
                const clubData = snap.data();
                // Transform the user data in owners and athletes into a more convenient format
                clubData.owners = clubData.owners.map((owner) => ({
                  email: owner.email,
                  name: owner.name,
                  role: "Owner",
                }));
                clubData.athletes = clubData.athletes.map((athlete) => ({
                  email: athlete.email,
                  name: athlete.name,
                  role: "Athlete",
                }));

                return clubData;
              });
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

  return <ClubContext.Provider value={clubs}>{children}</ClubContext.Provider>;
};
