import { useState } from "react";
import { useFirebase } from "../contexts/firebaseContext";

const useSendTransaction = () => {
  const { auth } = useFirebase();
  const [isTransactionLoading, setTransactionLoading] = useState(false);

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
      setTransactionLoading(true);
      const transactions = addresses.map((addr, index) => ({
        to_address: addr,
        amount: amounts[index], // Set amount for each address here
      }));

      const response = await fetch(
        "https://europe-west1-wallet-login-45c1c.cloudfunctions.net/transferGLCauth",
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
      setTransactionLoading(false);
      console.log(data);
    } catch (error) {
      setTransactionLoading(false);
      console.error("Error sending transaction:", error);
    }
  };

  return { handleSend, isTransactionLoading };
};

export default useSendTransaction;
