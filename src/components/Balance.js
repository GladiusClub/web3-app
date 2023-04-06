import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Balance from "./BalanceCard";

const AccountBalance = ({ myAddress }) => {
  const [balance, setBalance] = useState("");

  useEffect(() => {
    const provider = new ethers.providers.JsonRpcProvider(
      `https://goerli.infura.io/v3/${process.env.REACT_APP_INFURAAPIKEY}`
    );

    const fetchBalance = async () => {
      try {
        const rawBalance = await provider.getBalance(myAddress);
        const formattedBalance = ethers.utils.formatEther(rawBalance);
        setBalance(formattedBalance);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchBalance();
  }, [myAddress]);

  return <Balance amount={balance} token={"Goreli"}></Balance>;
};

export default AccountBalance;
