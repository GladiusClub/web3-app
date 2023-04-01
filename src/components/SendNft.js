import React from "react";
import { ethers } from "ethers";
import { Button } from "@mui/material";
import { useUser } from "./UserContext";
import AdvancedCollectible from "../contracts/AdvancedCollectible.json";

const contractAddress = "0x796461f6b086f036a7a85ff22e4eacab13110a57";

const provider = new ethers.providers.JsonRpcProvider(
  `https://goerli.infura.io/v3/${process.env.REACT_APP_INFURAAPIKEY}`
);

const SendNFTButton = ({ member }) => {
  const { userData } = useUser();
  const privateKey = userData.privateKey;

  const handleSendNFT = async (member) => {
    try {
      console.log(`Sending NFT to ${member.name} (${member.address})`);

      // Create signer with user's private key
      const signer = new ethers.Wallet(privateKey, provider);

      // Connect signer to the contract
      const contractWithSigner = new ethers.Contract(
        contractAddress,
        AdvancedCollectible.abi,
        signer
      );

      // Set up an event listener for the breedAssigned event
      contractWithSigner.on("breedAssigned", async (tokenId, breed, event) => {
        console.log("breedAssigned event received:", tokenId, breed, event);

        // Check if the event owner matches the current user
        if (true) {
            console.log(`Transfer NFT to ${member.name} (${member.address})`);
            // Call the transferFrom function to send the NFT to the member address
            const transferTransaction =
              await contractWithSigner.safeTransferFrom(
                userData.address, // From the user's address
                member.address, // To the member's address
                tokenId // The tokenId of the NFT to transfer
              );

          // Wait for the transaction to be mined
          const transferReceipt = await transferTransaction.wait();
          console.log("Transfer transaction mined:", transferReceipt);

          // Remove the event listener after the transfer is complete
          contractWithSigner.removeAllListeners("breedAssigned");
        }
      });

      // Call the createCollectible function on the contract
      const transaction = await contractWithSigner.createCollectible();

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
