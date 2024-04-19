import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  Box,
  CircularProgress,
  Typography,
  Button,
  Link,
} from "@mui/material";
import HorizontalLinearStepper from "./HorizontalLinearStepper";
import { useClub } from "../../contexts/clubContext";

function AddClassDialog({ open, handleClose }) {
  const { clubs, createNewGroup } = useClub();
  const [isLoading, setIsLoading] = useState(false);
  const [clubPublicKey, setClubPublicKey] = useState(null);
  const [gladiusSubscriptionsId, setGladiusSubscriptionsId] = useState(null);

  const handleSubmit = async (
    className,
    subscriptionFee,
    incentiveAmount,
    selectedEvents
  ) => {
    const clubId = clubs[0].id;
    const ownerId = clubs[0].members[0].id;
    setIsLoading(true);
    try {
      const response = await createNewGroup(
        clubId,
        ownerId,
        className,
        subscriptionFee,
        incentiveAmount,
        selectedEvents
      );
      setClubPublicKey(response.apiResponse.club_public_key);
      setGladiusSubscriptionsId(response.apiResponse.gladius_subscriptions_id);
    } catch (error) {
      console.error(`Error creating group: `, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => {}} disableEscapeKeyDown>
      <DialogTitle>Add Course</DialogTitle>
      <Box sx={{ margin: "16px" }}>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: 200,
            }}
          >
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Creating course...</Typography>
          </Box>
        ) : clubPublicKey ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ mb: 2 }}>Course created on Stellar:</Typography>
            <Link
              href={`https://stellar.expert/explorer/testnet/account/${clubPublicKey}`}
              target="_blank"
              rel="noopener"
            >
              View on Club Wallet:
            </Link>
            <Typography sx={{ mt: 2, mb: 2 }}>
              Stellar Course Contract:
            </Typography>
            <Link
              href={`https://testnet.stellarchain.io/contracts/${gladiusSubscriptionsId}`}
              target="_blank"
              rel="noopener"
            >
              View Contract
            </Link>
          </Box>
        ) : (
          <HorizontalLinearStepper handleSubmit={handleSubmit} />
        )}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", padding: "8px" }}>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </Box>
    </Dialog>
  );
}

export default AddClassDialog;
