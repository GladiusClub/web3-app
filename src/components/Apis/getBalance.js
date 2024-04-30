const getBalance = async (address) => {
  const url = `https://europe-west1-wallet-login-45c1c.cloudfunctions.net/getStudentBalance?publicKey=${encodeURIComponent(
    address
  )}`;

  console.log("Fetching URL:", url);

  try {
    const response = await fetch(url); // Using GET method now

    if (!response.ok) {
      throw new Error(`Failed to fetch balance, status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Response received:", result);

    // Assuming the response JSON structure includes 'balanceEURC' and 'balanceGLC'
    const balances = {
      balanceEURC: result.balanceEURC,
      balanceGLC: result.balanceGLC,
    };

    console.log("balances to return", balances);

    return balances;
  } catch (error) {
    console.error("Error fetching balance:", error);
    throw error; // Rethrow or handle as needed
  }
};

export default getBalance;
