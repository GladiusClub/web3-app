// AuthLoading.js
import React, { useState, useEffect } from "react";
import { useFirebase } from "./firebaseContext";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function AuthLoading({ children }) {
  const { auth } = useFirebase();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}

export default AuthLoading;
