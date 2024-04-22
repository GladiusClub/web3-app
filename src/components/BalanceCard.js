import React, { useState, useEffect, useCallback } from "react";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import getBalance from "./Apis/getBalance";

const BalanceCard = ({ address }) => {
  const [balance, setBalance] = useState(null); // Initially no balance

  const fetchBalance = useCallback(async () => {
    try {
      const fetchedBalance = await getBalance(address);
      setBalance(fetchedBalance);
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      setBalance("Error");
    }
  }, [address]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const handleViewTransactions = () => {
    if (address) {
      const url = `https://stellar.expert/explorer/testnet/account/${address}`;
      window.open(url, "_blank");
    } else {
      console.error("No address provided"); // Useful for debugging
    }
  };

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
            {balance === null ? (
              <CircularProgress /> // Show loading spinner when balance is null
            ) : (
              `${balance} GLC` // Show balance once loaded
            )}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between" }}>
          <Button
            color="secondary"
            size="small"
            onClick={handleViewTransactions}
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
