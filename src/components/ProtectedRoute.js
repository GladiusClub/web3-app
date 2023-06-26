import React from "react";
import { useUser } from "./contexts/UserContext";
import LandingPage from "./LandingPage";

const ProtectedRoute = ({ element }) => {
  const { user } = useUser(); // assuming your UserContext provides a user state

  // Render the protected component only if the user is authenticated, otherwise redirect to the login page
  const renderProtectedComponent = () => {
    if (user) {
      return element;
    } else {
      return <LandingPage />;
    }
  };

  return renderProtectedComponent();
};

export default ProtectedRoute;
