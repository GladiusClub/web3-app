import React, { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import GLCToken from "../contracts/GLCToken.json";
import Button from "@mui/material/Button";

const contractAddress = "0x7A57269A63F37244c09742d765B18b1852078072";

const provider = new ethers.providers.JsonRpcProvider(
  `https://polygon-mumbai.infura.io/v3/${process.env.REACT_APP_INFURAAPIKEY}`
);
const contract = new ethers.Contract(contractAddress, GLCToken.abi, provider);

const BalanceCard = ({ address }) => {
  const [balance, setBalance] = useState("");

  const fetchBalance = useCallback(() => {
    if (!address) {
      return;
    }

    (async () => {
      try {
        const rawBalance = await contract.balanceOf(address);
        const decimals = await contract.decimals();
        const formattedBalance = ethers.utils.formatUnits(rawBalance, decimals);
        setBalance(formattedBalance);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    })();
  }, [address]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

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
            Your Balance
          </Typography>
          <Typography variant="h5" component="div">
            {balance ? `${balance} GLC` : "No Balance Detected"}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between" }}>
          <Button
            color="secondary"
            size="small"
            onClick={() =>
              window.open(
                `https://mumbai.polygonscan.com/address/${address}#tokentxns`,
                "_blank"
              )
            }
          >
            View Transactions
          </Button>
          <IconButton size="small" onClick={fetchBalance}>
            <RefreshIcon />
          </IconButton>
        </CardActions>
      </Box>
    </Card>
  );
};

export default BalanceCard;
