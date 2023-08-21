import { useState } from "react";
import { useFirebase } from "../contexts/firebaseContext";

const useSendTransaction = () => {
  const { auth } = useFirebase();
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (addresses, amount) => {
    if (!addresses || (Array.isArray(addresses) && addresses.length === 0)) {
      console.error(
        "Please provide a valid address or addresses before sending."
      );
      return;
    }

    // Convert single address to an array for consistency in processing
    const addressArray = Array.isArray(addresses) ? addresses : [addresses];

    const idToken = await auth.currentUser.getIdToken(true);

    try {
      setIsLoading(true);
      const transactions = addressArray.map((addr) => ({
        to_address: addr,
        amount: amount,
      }));

      const response = await fetch(
        "https://us-central1-wallet-login-45c1c.cloudfunctions.net/mumbai_token_transfer",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transactions: transactions,
          }),
        }
      );
      const data = await response.json();
      setIsLoading(false);
      console.log(data);
    } catch (error) {
      setIsLoading(false);
      console.error("Error sending transaction:", error);
    }
  };

  return { handleSend, isLoading };
};

export default useSendTransaction;
