import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { useFirebase } from "./contexts/firebaseContext";

const SendTransactionCard = ({ clubMembers }) => {
  const { auth } = useFirebase();
  const [selectedAddress, setSelectedAddress] = React.useState("");
  const [amount, setAmount] = React.useState(""); // State for amount
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSend = async () => {
    // Ensure an address is selected before proceeding
    if (!selectedAddress) {
      console.error("Please select a member's address before sending.");
      return;
    }

    // Assuming the user is signed in and the necessary auth handling is in place
    const idToken = await auth.currentUser.getIdToken(true);

    try {
      setIsLoading(true);
      const response = await fetch(
        "https://us-central1-wallet-login-45c1c.cloudfunctions.net/mumbai_token_transfer",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to_address: selectedAddress, // Use the address from state
            amount: amount,
            mint: false,
          }),
        }
      );

      const data = await response.json();
      setIsLoading(false);
      console.log(data);
    } catch (error) {
      setIsLoading(false);
      console.error("Error sending transaction:", error);
    }
  };

  // ... other imports and code ...

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
            Send Transaction
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
              {" "}
              {/* Add this Box */}
              <FormControl fullWidth>
                <InputLabel id="address-select-label">Select Member</InputLabel>
                <Select
                  labelId="address-select-label"
                  value={selectedAddress}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                  label="Select Member"
                >
                  {clubMembers.map((member) => (
                    <MenuItem key={member.address} value={member.address}>
                      {member.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
              {" "}
              {/* Add this Box */}
              <FormControl fullWidth>
                <TextField
                  label="Amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </FormControl>
            </Box>
          </Box>
        </CardContent>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              paddingRight: "1rem",
            }}
          >
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button color="secondary" onClick={handleSend}>
              Send
            </Button>
          </CardActions>
        )}
      </Box>
    </Card>
  );
};

export default SendTransactionCard;
