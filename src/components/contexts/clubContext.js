import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
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

  const fetchClubsForUser = useCallback(
    (uid) => {
      const userDocRef = doc(db, "users", uid);
      getDoc(userDocRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            console.log("User document found, fetching club data...");
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
                const members = await Promise.all(
                  memberQuerySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                  }))
                );

                clubData.members = members;
                return clubData;
              })
            )
              .then((clubsData) => {
                console.log("Clubs data loaded and set.");
                setClubs(clubsData);
              })
              .catch((error) =>
                console.error("Error loading club data:", error)
              );
          } else {
            console.log("No user document found, setting clubs to empty.");
            setClubs([]);
          }
        })
        .catch((error) =>
          console.error("Error fetching user document:", error)
        );
    },
    [db]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchClubsForUser(user.uid);
      } else {
        console.log("No user logged in, clearing clubs data.");
        setClubs([]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth, fetchClubsForUser]);

  const value = {
    clubs,
    refreshClubs: () =>
      auth.currentUser && fetchClubsForUser(auth.currentUser.uid),
    ...clubActions,
  };

  return <ClubContext.Provider value={value}>{children}</ClubContext.Provider>;
};
