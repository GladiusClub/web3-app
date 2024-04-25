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
import FormHelperText from "@mui/material/FormHelperText";


const SendTransactionCard = ({ clubMembers }) => {
  const [selectedAddress, setSelectedAddress] = React.useState("");
  const [amount, setAmount] = React.useState([""]);
  const { handleSend, isTransactionLoading } = useSendTransaction();
  const [error, setError] = React.useState(false);
  console.log("clubMembers", clubMembers);

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
              <FormControl fullWidth error={error}>
                <InputLabel id="address-select-label">Select Member</InputLabel>
                <Select
                  labelId="address-select-label"
                  value={selectedAddress}
                  onChange={(e) => {
                    const selectedValue = e.target.value || "";
                    setSelectedAddress(selectedValue);
                    setError(!selectedValue);
                  }}
                  label="Select Member"
                >
                  {clubMembers.map((member) => (
                    <MenuItem key={member.id} value={member.stellar_wallet}>
                      {member.name}
                    </MenuItem>
                  ))}
                </Select>
                {error && (
                  <FormHelperText>Error: Address is null</FormHelperText>
                )}
              </FormControl>
            </Box>
            <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
              <FormControl fullWidth>
                <TextField
                  label="Amount"
                  type="number"
                  value={amount[0]}
                  onChange={(e) => setAmount([e.target.value])}
                />
              </FormControl>
            </Box>
          </Box>
        </CardContent>
        {isTransactionLoading ? (
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
              onClick={() => {
                if (selectedAddress && amount[0] > 0) {
                  handleSend([selectedAddress], amount);
                } else {
                  setError(true);
                }
              }}
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
