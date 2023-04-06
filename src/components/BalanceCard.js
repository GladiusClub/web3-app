import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function Balance({ amount, token }) {
  return (
    <Card sx={{ minWidth: 275, maxWidth: "30%", margin: "10px" }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Your Balance{" "}
        </Typography>
        <Typography variant="h5" component="div">
          {amount ? `${amount} ${token}` : "0.542 GLD"}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">View Transactions</Button>
      </CardActions>
    </Card>
  );
}
