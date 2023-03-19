import Web3 from "web3";

const web3 = new Web3(
  `https://goerli.infura.io/v3/${process.env.REACT_APP_MEASUREMENTID}`
);

export function createNewWallet() {
  web3.eth.net
    .isListening()
    .then(() => console.log("is connected"))
    .catch((e) => console.log("Wow. Something went wrong: " + e));

  const newWallet = web3.eth.accounts.create();
  return newWallet;
}
