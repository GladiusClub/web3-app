import { useState, useEffect } from "react";
import { ethers } from "ethers";
import AdvancedCollectible from "../contracts/AdvancedCollectible.json";
import { IpfsImage } from "react-ipfs-image";
import axios from "axios";

const myAddress = "0xce912f29932994e60a7aeea9f18f7c16e086cbac";
const contractAddress = "0x796461f6b086f036a7a85ff22e4eacab13110a57";

const provider = new ethers.providers.JsonRpcProvider(
  `https://goerli.infura.io/v3/${process.env.REACT_APP_INFURAAPIKEY}`
);
const contract = new ethers.Contract(
  contractAddress,
  AdvancedCollectible.abi,
  provider
);

const NFTs = () => {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    const getBalance = async () => {
      const balance = await contract.balanceOf(myAddress);
      const nftData = [];
      let i = 0;
      const totalSupply = await contract.totalSupply();

      while (nftData.length < balance.toNumber() && i < totalSupply) {
        const tokenId = await contract.tokenByIndex(i);
        let owner = await contract.ownerOf(tokenId);
        owner = owner.toLowerCase();

        if (owner === myAddress.toLowerCase()) {
          const tokenUri = await contract.tokenURI(tokenId);
          const tokenCID = tokenUri.split("ipfs://")[1].split("?")[0];

          const response = await axios.get(
            `https://nftstorage.link/ipfs/${tokenCID}`
          );
          const image = response.data.image;
          const cid = image.split("/ipfs/")[1].split("?")[0];
          nftData.push(cid);
        }
        i++;
      }

      setNfts(nftData);
    };

    getBalance();
  }, []);

  return (
    <div>
      {nfts.map((nft, index) => (
        <IpfsImage key={index} hash={nft} />
      ))}
    </div>
  );
};

export default NFTs;
