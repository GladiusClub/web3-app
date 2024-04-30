import { useState } from "react";
import { useFirebase } from "../contexts/firebaseContext";

const useBurnGlc = () => {
  const { auth } = useFirebase();
  const [isTransactionLoading, setTransactionLoading] = useState(false);
  const [burnResult, setBurnResult] = useState(null); // State for storing the response
  const [error, setError] = useState(null); // State for storing the error

  const handleBurn = async (amount) => {
    setBurnResult(null); // Reset the response state before new request
    setError(null); // Reset the error state before new request
    if (!amount || isNaN(amount)) {
      const errorMessage = "Please provide a valid amount to burn.";
      console.error(errorMessage);
      setError(errorMessage);
      return;
    }

    const idToken = await auth.currentUser.getIdToken(true);

    try {
      setTransactionLoading(true);
      const response = await fetch(
        "https://europe-west1-wallet-login-45c1c.cloudfunctions.net/burnGLCauth",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transactions: [{ amount: amount }] }),
        }
      );

      const data = await response.json();
      setBurnResult(data); // Update the state with the response data
      setTransactionLoading(false);
    } catch (error) {
      console.error("Error burning GLC:", error);
      setError(error.toString()); // Update the state with the error
      setTransactionLoading(false);
    }
  };

  // Make sure to return these functions and state variables
  return {
    handleBurn,
    isTransactionLoading,
    burnResult,
    setBurnResult,
    error,
    setError,
  };
};

export default useBurnGlc;
