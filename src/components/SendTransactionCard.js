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
import useSendTransaction from "./CustomHooks/useSendTransaction";

const SendTransactionCard = ({ clubMembers }) => {
  const [selectedAddress, setSelectedAddress] = React.useState("");
  const [amount, setAmount] = React.useState(""); // State for amount
  const { handleSend, isLoading } = useSendTransaction();

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
            <Button
              color="secondary"
              onClick={() => handleSend(selectedAddress, amount)}
            >
              Send
            </Button>
          </CardActions>
        )}
      </Box>
    </Card>
  );
};

export default SendTransactionCard;
