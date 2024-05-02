const mintGladiusNFT = async (firebaseIdToken, transactions) => {
  const url =
    "https://europe-west1-wallet-login-45c1c.cloudfunctions.net/mintGladiusNFT";

  const jsonData = JSON.stringify({ transactions });

  console.log(`curl -X POST '${url}' \\
    -H 'Authorization: Bearer ${firebaseIdToken}' \\
    -H 'Content-Type: application/json' \\
    -d '${jsonData.replace(/"/g, '\\"')}'`);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${firebaseIdToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transactions }),
    });

    if (!response.ok) {
      throw new Error(`Failed to mint NFT, status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Response received:", result);

    return result;
  } catch (error) {
    console.error("Error minting NFT:", error);
    throw error;
  }
};

export default mintGladiusNFT;
