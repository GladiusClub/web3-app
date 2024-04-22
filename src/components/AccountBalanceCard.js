import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import getBalance from "./Apis/getBalance"; // Ensure the path to your API call is correct

const BalanceCard = ({ address }) => {
  const [balance, setBalance] = useState("Loading..."); // Initial state for balance

  // Define fetchBalance function outside useEffect to use it in the onClick handler as well
  const fetchBalance = async () => {
    try {
      const fetchedBalance = await getBalance(); // Call getBalance (modify to pass address if needed)
      setBalance(fetchedBalance);
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      setBalance("Error"); // Set balance to error or handle it accordingly
    }
  };

  useEffect(() => {
    fetchBalance(); // Call fetchBalance when component mounts or address changes
  }, [address]); // Depend on address to refetch when it changes

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
            {balance} GLC // Display dynamic balance
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
          <IconButton
            size="small"
            onClick={fetchBalance} // Now fetchBalance is defined and can be used here
          >
            <RefreshIcon />
          </IconButton>
        </CardActions>
      </Box>
    </Card>
  );
};

export default BalanceCard;
