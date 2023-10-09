import { useEffect, useState } from "react";
import { query, collection, where, getDocs } from "firebase/firestore";
import { useFirebase } from "../contexts/firebaseContext";

export function usePublicClubs() {
  const { db } = useFirebase();
  const [clubs, setClubs] = useState({});

  useEffect(() => {
    async function fetchClubs() {
      // Create a query against the 'clubs' collection for public == true
      const qTrue = query(collection(db, "clubs"), where("public", "==", true));

      const clubList = {};

      // Execute the first query and store results
      const querySnapshotTrue = await getDocs(qTrue);
      querySnapshotTrue.forEach((doc) => {
        clubList[doc.id] = doc.data().name;
      });

      // Fetch all clubs and filter out ones where 'public' is false
      const qAll = query(collection(db, "clubs"));
      const querySnapshotAll = await getDocs(qAll);
      querySnapshotAll.forEach((doc) => {
        if (doc.data().public !== false) {
          clubList[doc.id] = doc.data().name;
        }
      });

      setClubs(clubList);
    }

    fetchClubs();
  }, [db]);

  return clubs;
}
