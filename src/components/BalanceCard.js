import React, { useEffect, useState } from "react";
import GLCToken from "../contracts/GLCToken.json";
import { ethers } from "ethers";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const myAddress = "0xce912F29932994e60A7aEEa9F18F7C16E086CBAc";
const contractAddress = "0x7A57269A63F37244c09742d765B18b1852078072";

const provider = new ethers.providers.JsonRpcProvider(
  `https://polygon-mumbai.infura.io/v3/${process.env.REACT_APP_INFURAAPIKEY}`
);

const contract = new ethers.Contract(contractAddress, GLCToken.abi, provider);

const BalanceCard = () => {
  const [balance, setBalance] = useState("");

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const rawBalance = await contract.balanceOf(myAddress);
        const decimals = await contract.decimals();
        const formattedBalance = ethers.utils.formatUnits(rawBalance, decimals);
        setBalance(formattedBalance);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchBalance();
  }, []);

  return (
    <Card
      sx={{ minWidth: 275, maxWidth: "30%", margin: "10px", maxHeight: 150 }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Your Balance{" "}
          </Typography>
          <Typography variant="h5" component="div">
            {balance ? `${balance} GLC` : "No Balance Detected"}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">View Transactions</Button>
        </CardActions>
      </Box>
    </Card>
  );
};

export default BalanceCard;
