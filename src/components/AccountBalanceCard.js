import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import BalanceCard from "./BalanceCard";

const AccountBalanceCard = ({ myAddress }) => {
  const [balance, setBalance] = useState("");
  let myAddress = "0xce912F29932994e60A7aEEa9F18F7C16E086CBAc";

  useEffect(() => {
    const provider = new ethers.providers.JsonRpcProvider(
      `https://polygon-mumbai.infura.io/v3/${process.env.REACT_APP_INFURAAPIKEY}`
    );

    const fetchBalance = async () => {
      try {
        const rawBalance = await provider.getBalance(myAddress);
        const formattedBalance = ethers.utils.formatEther(rawBalance);
        setBalance(formattedBalance);
        console.error("Fetching balance:", formattedBalance);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchBalance();
  }, []);

  return <BalanceCard amount={balance} token={"Goreli"}></BalanceCard>;
};

export default AccountBalance;
