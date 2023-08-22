import React, { useEffect, useState } from "react";
import { useUser } from "./contexts/UserContext";
import LandingPage from "./LandingPage";
import { doc, getDoc } from "firebase/firestore";
import { useFirebase } from "./contexts/firebaseContext";
import { Navigate } from "react-router-dom"; // make sure to import Navigate for redirection

const ProtectedRoute = ({ element, routeType }) => {
  const { user } = useUser();
  const { db } = useFirebase();
  const [userRole, setUserRole] = useState();
  const [loading, setLoading] = useState(true); // introduce loading state

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
      setLoading(false); // role fetching is done, set loading to false
    };
    setUserRole(null);
    setLoading(true);

    fetchUserRole();
  }, [user, db]);

  const renderProtectedComponent = () => {
    if (loading) {
      return <div>Loading...</div>; // or return some spinner component
    }

    if (!user) {
      return <LandingPage />;
    }

    if (
      routeType === "user" ||
      (routeType === "club" && userRole === "owner")
    ) {
      return element;
    }

    return <Navigate to="/" />;
  };

  return renderProtectedComponent();
};

export default ProtectedRoute;
