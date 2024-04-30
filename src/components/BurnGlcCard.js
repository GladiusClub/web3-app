import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import useBurnGlc from "./CustomHooks/useBurnGlc"; // Import your hook

const BurnGlcCard = () => {
  const [amount, setAmount] = useState("");
  const [conversion, setConversion] = useState("");

  const {
    handleBurn,
    isTransactionLoading,
    burnResult,
    setBurnResult,
    error,
    setError,
  } = useBurnGlc();
  const [inputError, setInputError] = useState(false);

  const handleAmountChange = (event) => {
    const inputValue = event.target.value;
    setAmount(inputValue);
    setBurnResult(null);
    setError(null);

    if (
      !isNaN(parseInt(inputValue, 10)) &&
      parseInt(inputValue, 10) > 0 &&
      parseInt(inputValue, 10) % 1000 === 0
    ) {
      setInputError(false);
      setConversion(`Will convert to ${parseInt(inputValue, 10) / 1000} Eurc`);
    } else if (inputValue !== "") {
      setInputError(true);
    }
  };

  const handleBurnClick = async () => {
    const numericValue = parseInt(amount, 10);
    if (!isNaN(numericValue) && numericValue > 0 && numericValue % 1000 === 0) {
      await handleBurn(numericValue / 1000);
      setInputError(false);
    } else {
      setInputError(true);
    }
  };

  return (
    <Card
      sx={{ minWidth: 275, maxWidth: "60%", margin: "10px", maxHeight: 200 }}
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
            Burn GLC Tokens
          </Typography>
          <FormControl fullWidth error={inputError}>
            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={handleAmountChange}
              helperText={
                inputError
                  ? "Amount must be a positive multiple of 1000 GLC"
                  : conversion
              }
              error={inputError}
              inputProps={{ step: 1000 }}
            />
          </FormControl>
        </CardContent>
        {isTransactionLoading ? (
          <CircularProgress color="secondary" sx={{ alignSelf: "center" }} />
        ) : (
          <CardActions sx={{ justifyContent: "flex-end" }}>
            {burnResult && (
              <Typography color="primary" sx={{ mr: 1 }}>
                Transaction successful: {JSON.stringify(burnResult)}
              </Typography>
            )}
            {error && (
              <Typography color="error" sx={{ mr: 1 }}>
                Error: {error}
              </Typography>
            )}
            <Button
              color="secondary"
              onClick={handleBurnClick}
              disabled={!amount || inputError}
            >
              Burn
            </Button>
          </CardActions>
        )}
      </Box>
    </Card>
  );
};

export default BurnGlcCard;
