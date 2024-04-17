import React from "react";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const BalanceCard = ({ address }) => {
  const hardcodedBalance = "100"; // Hardcoded balance

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
            {hardcodedBalance} GLC
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
            onClick={() =>
              alert("Refresh not available. Balance is hardcoded.")
            }
          >
            <RefreshIcon />
          </IconButton>
        </CardActions>
      </Box>
    </Card>
  );
};

export default BalanceCard;
