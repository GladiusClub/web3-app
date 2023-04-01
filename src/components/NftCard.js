import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
} from "@mui/material";

import pugImg from "../img/pug.png";
import shibaInuImg from "../img/shiba-inu.png";
import stBernardImg from "../img/st-bernard.png";

const imageData = [
  {
    src: pugImg,
    description: "Pug - A small, friendly, and lovable companion.",
  },
  {
    src: shibaInuImg,
    description: "Shiba Inu - A spirited, agile, and bold breed.",
  },
  {
    src: stBernardImg,
    description: "St. Bernard - A strong, gentle, and devoted giant.",
  },
];

const NftCard = () => {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={2} rowSpacing={1}>
          {imageData.map((img, index) => (
            <Grid key={index} item xs={4}>
              <CardMedia
                component="img"
                image={img.src}
                alt={img.description}
              />
            </Grid>
          ))}
        </Grid>
        <Box mt={1} display="flex" justifyContent="space-around">
          {imageData.map((img, index) => (
            <Box key={index} minHeight="3em" width="30%">
              <Typography variant="body2" align="center">
                {img.description}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box display="flex" justifyContent="space-around" mt={1}>
          {imageData.map((_, index) => (
            <Button key={index} variant="contained" color="primary">
              Send!
            </Button>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

const ShowNftCardButton = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="secondary" onClick={handleClickOpen}>
        Send NFT
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="nft-card-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="nft-card-dialog-title">Send a doggy NFT!</DialogTitle>
        <DialogContent>
          <NftCard />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShowNftCardButton;
