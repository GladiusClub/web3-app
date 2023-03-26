import React from "react";
import { useUser } from "./UserContext";
import LandingPage from "./sections/LandingPage";

const ProtectedRoute = ({ element }) => {
  const { user } = useUser(); // assuming your UserContext provides a user state
  console.log(user);

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
