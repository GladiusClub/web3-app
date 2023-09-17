import { useState } from "react";
import { useFirebase } from "../contexts/firebaseContext";

const useSendTransaction = () => {
  const { auth } = useFirebase();
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (addresses, amounts) => {
    if (!addresses || (Array.isArray(addresses) && addresses.length === 0)) {
      console.error(
        "Please provide a valid address or addresses before sending."
      );
      return;
    }

    if (!amounts || (Array.isArray(amounts) && amounts.length === 0)) {
      console.error("Please provide a valid amount or amounts before sending.");
      return;
    }

    if (addresses.length !== amounts.length) {
      console.error("The number of addresses and amounts should be the same.");
      return;
    }

    const idToken = await auth.currentUser.getIdToken(true);

    try {
      setIsLoading(true);
      const transactions = addresses.map((addr, index) => ({
        to_address: addr,
        amount: amounts[index], // Set amount for each address here
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
