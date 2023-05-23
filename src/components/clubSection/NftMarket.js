import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const imageNames = [
  "Neon Samurai",
  "Hacker's Paradise",
  "Synthwave Dreams",
  "Digital Nomad",
  "Cyberspace Odyssey",
  "Techno Titan",
  "Pixelated Phoenix",
  "Binary Vision",
  "Electric Empire",
  "Cyber Cityscape",
  "Retro Renegade",
  "Data Dystopia",
  "Futuristic Fantasy",
  "Virtual Vigilante",
  "Future Fiction",
  "Artificial Anarchy",
  "Robot Rebellion",
  "Machine Messiah",
  "Technotronic Tyrant",
];

export default function NftMarket() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function loadImages() {
      const loadedImages = await Promise.all(
        Array.from({ length: 12 }, async (_, i) => {
          const img = await import(`../../img/gladius_samples/${i + 1}.jpg`);
          return img.default;
        })
      );
      setImages(loadedImages);
    }

    loadImages();
  }, []);

  const handleBuyClick = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const cardStyle = {
    maxWidth: 345,
    margin: 16,
  };

  const mediaStyle = {
    height: 140,
    marginBottom: "8px",
  };

  return (
    <div>
      {images && images.length > 0 && (
        <Box display="flex" justifyContent="center" marginBottom="16px">
          <NftCollection
            title="Club Defence"
            description="Discover our curated collection of sports club logo shields. Meticulously crafted, these pieces celebrate various sports clubs, perfect for enthusiasts and collectors."
            images={images}
          />
        </Box>
      )}

      <Grid container justifyContent="center" spacing={4}>
        {images.map((image, index) => (
          <Grid key={index} item>
            <Card style={cardStyle}>
              <CardMedia
                style={mediaStyle}
                component="img"
                src={image}
                title={imageNames[index]}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {imageNames[index]}
                </Typography>
              </CardContent>
              <CardActions>
                <Box flexGrow={1}></Box>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  sx={{ fontSize: "0.8rem" }}
                  onClick={() => handleBuyClick(image)}
                >
                  Buy
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <BuyDialog open={open} onClose={handleClose} image={selectedImage} />
    </div>
  );
}

const NftCollection = ({ title, description, images }) => {
  const paperStyle = {
    padding: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "80%",
    height: "200px",
    background: "linear-gradient(to right, darkmagenta, palevioletred)", // Gradient background
  };

  const imageStyle = {
    height: "100%",
    width: "auto",
  };

  const textContainerStyle = {
    marginLeft: "50px",
    color: "#fff",
  };

  return (
    <Paper style={paperStyle}>
      <img src={images[0]} alt={title} style={imageStyle} />
      <div style={textContainerStyle}>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        <Typography variant="body1" style={{ marginTop: "8px" }}>
          {description}
        </Typography>
      </div>
    </Paper>
  );
};

function BuyDialog({ open, onClose, image }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Buy NFT</DialogTitle>
      <DialogContent>
        <DialogContent>
          <Box display="flex">
            <img
              src={image}
              alt=""
              style={{ width: "50%", height: "auto", marginRight: "16px" }}
            />
            <DialogContentText>
              {/* Placeholder metadata */}
              Title: Placeholder Title
              <br />
              Price: $100
            </DialogContentText>
          </Box>
        </DialogContent>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onClose}>Add to Basket</Button>
        <Button onClick={onClose} color="secondary">
          Buy Now
        </Button>
      </DialogActions>
    </Dialog>
  );
}