import React from "react";
import { ethers } from "ethers";
import { Button } from "@mui/material";
import { useUser } from "./contexts/UserContext";
import SimpleCollectible from "../contracts/SimpleCollectible.json";

const contractAddress = "0x91B2a730a76b50556Cb14B381D93040ca94f3C2A";

const provider = new ethers.providers.JsonRpcProvider(
  `https://goerli.infura.io/v3/${process.env.REACT_APP_INFURAAPIKEY}`
);

const SendNFTButton = ({ member, dog }) => {
  const { userData } = useUser();
  const privateKey = userData.privateKey;

  const handleSendNFT = async (member) => {
    try {
      console.log(
        `Sending Dog type ${dog.nftIndex}  to ${member.name} (${member.address})`
      );

      // Create signer with user's private key
      const signer = new ethers.Wallet(privateKey, provider);

      // Connect signer to the contract
      const contractWithSigner = new ethers.Contract(
        contractAddress,
        SimpleCollectible.abi,
        signer
      );

      // Call the createCollectible function on the contract
      const transaction = await contractWithSigner.createCollectible(
        dog.nftIndex,
        member.address
      );

      // Wait for the transaction to be mined
      const createReceipt = await transaction.wait();
      console.log("Transaction mined:", createReceipt);
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
