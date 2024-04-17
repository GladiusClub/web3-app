import React from "react";
import { Button } from "@mui/material";
import { useUser } from "./contexts/UserContext";

const SendNFTButton = ({ member, dog }) => {
  const { userData } = useUser();

  const handleSendNFT = async (member) => {
    try {
      console.log(
        `Simulating sending Dog type ${dog.nftIndex} to ${member.name} (${member.address})`
      );

      // Simulate a successful transaction without interacting with the blockchain
      setTimeout(() => {
        console.log(
          "Transaction successful: Simulated transaction receipt here"
        );
      }, 1000); // simulate network delay
    } catch (error) {
      console.error("Error sending NFT:", error);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => {
          if (member && userData) {
            handleSendNFT(member);
          } else {
            console.warn("Member or user data is not available yet.");
          }
        }}
      >
        Send NFT
      </Button>
    </div>
  );
};

export default SendNFTButton;
