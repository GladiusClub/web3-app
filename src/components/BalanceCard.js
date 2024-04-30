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
  const [balances, setBalances] = useState({
    glcBalance: null,
    eurcBalance: null,
  });

  const fetchBalance = useCallback(async () => {
    if (address) {
      try {
        const fetchedBalances = await getBalance(address);
        console.log(fetchedBalances);
        setBalances({
          glcBalance: fetchedBalances.balanceGLC,
          eurcBalance: fetchedBalances.balanceEURC,
        });
      } catch (error) {
        console.error("Failed to fetch balance:", error);
        setBalances({ glcBalance: "Error", eurcBalance: "Error" });
      }
    } else {
      console.log("No address provided, skipping fetch");
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
      console.error("No address provided");
    }
  };

  return (
    <Card
      sx={{ minWidth: 275, maxWidth: "30%", margin: "10px", maxHeight: 180 }}
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
            Your Balances
          </Typography>
          {balances.glcBalance === null || balances.eurcBalance === null ? (
            <CircularProgress />
          ) : (
            <>
              <Typography variant="h5" component="div">
                {balances.eurcBalance} EURC
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "#ddd",
                  margin: "8px 0",
                }}
              />
              <Typography variant="h5" component="div">
                {balances.glcBalance} GLC
              </Typography>
            </>
          )}
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
