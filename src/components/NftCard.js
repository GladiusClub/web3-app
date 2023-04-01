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
import SendNFTButton from "./SendNft";

const imageData = [
  {
    src: pugImg,
    description: "Pug - A small, friendly, and lovable companion.",
    nftIndex: 2,
  },
  {
    src: shibaInuImg,
    description: "Shiba Inu - A spirited, agile, and bold breed.",
    nftIndex: 0,
  },
  {
    src: stBernardImg,
    description: "St. Bernard - A strong, gentle, and devoted giant.",
    nftIndex: 1,
  },
];

const NftCard = ({ member }) => {
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
          {imageData.map((dog, index) => (
            <SendNFTButton
              key={index}
              member={member}
              dog={dog}
            ></SendNFTButton>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

const ShowNftCardButton = ({ member }) => {
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
          <NftCard member={member} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShowNftCardButton;
