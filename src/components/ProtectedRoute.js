import React, { useEffect, useState } from "react";
import { useUser } from "./contexts/UserContext";
import LandingPage from "./LandingPage";
import { doc, getDoc } from "firebase/firestore";
import { useFirebase } from "./contexts/firebaseContext";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ element, routeType }) => {
  const { user } = useUser();
  const { db } = useFirebase();
  const [userRole, setUserRole] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user && user.uid) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          const clubRoles = userData.clubs_roles;

          if (clubRoles && clubRoles.length > 0) {
            const firstRole = clubRoles[0];
            const localUserRole = firstRole.role;
            setUserRole(localUserRole);
          }
        }
      }
      setLoading(false);
    };

    setUserRole(null);
    setLoading(true);
    fetchUserRole();
  }, [user, db]);

  const shouldNavigateAway = () => {
    if (!loading) {
      if (!user) {
        return true;
      }
      if (
        routeType !== "user" &&
        !(routeType === "club" && userRole === "owner")
      ) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (shouldNavigateAway()) {
      navigate("/");
    }
  }, [loading, user, userRole]);

  if (loading) {
    return <div>Loading...</div>; // or return some spinner component
  }

  if (shouldNavigateAway()) {
    return null;
  }

  return element;
};

export default ProtectedRoute;
