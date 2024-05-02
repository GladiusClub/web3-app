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

export default function NftMarket() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function loadImages() {
      try {
        const urls = [
          "https://gateway.pinata.cloud/ipfs/QmZ86NhwMLNiYWU8zYPssbYGV2mn5mdev6jxNj5XFFE6Pd",
          "https://gateway.pinata.cloud/ipfs/QmddnDy29c6Tycg65bmCFVcJtGiN9xWGhzNmC2eYEjeDt7",
          "https://gateway.pinata.cloud/ipfs/QmYUke9xBEQj4f6hV89t6vKLtnuaEMnNeZwPXwCUbBREsn",
          "https://gateway.pinata.cloud/ipfs/Qma8cfDY2wrC6jZPsfdaa2TJFdJenLknhbsQiXDUTELp34",
          "https://gateway.pinata.cloud/ipfs/QmTudeuif6Lxahf3RvSLW1iaPTGFy8waZZ6KH1Rzijyw2U",
          "https://gateway.pinata.cloud/ipfs/QmXdLWeMybvbHyqmF86kC3HnKRop3kQnZhGtDWer9MwwkW",
          "https://gateway.pinata.cloud/ipfs/QmR8VCDPya4Fvvfxaf889bbjyZ3wCZH3n8mpZ8FqdhS956",
          "https://gateway.pinata.cloud/ipfs/QmdxR6UeywgjXQ8Z3oMd3t2JMwGGtUAhYpYT9yeYMe2z5k",
          "https://gateway.pinata.cloud/ipfs/QmXbhiBup29jF7ARG4SNNTfA7HnohPRfSMj2Wf8jgz86Wb",
          "https://gateway.pinata.cloud/ipfs/QmWii8P4SdqARar7H1JuM6VZ4Zqgrkv2aLC3spPh6ZrFJX",
          "https://gateway.pinata.cloud/ipfs/QmSFZYcdCxA7qDdQUCUZ2sqrYLYhj2YCc5YCqsZo9bXYL1",
          "https://gateway.pinata.cloud/ipfs/QmYhqZ9VKtnoCCXu53SHfk3LfZE9bFBKPZRZ3qUvtbFdTx",
          "https://gateway.pinata.cloud/ipfs/QmUmSr5fUtekmabwnr7vTzmBLha6rhThVPKPRDb6eBn7SX",
          "https://gateway.pinata.cloud/ipfs/QmSjbZod9DXZgLR4hMoCeiJ7mxZTgy2NbmDFHKT5PN9Tbe",
          "https://gateway.pinata.cloud/ipfs/QmT88GH6uguBBPBbWAexNGjKg6A4XS3GPVZqTS6FBLbpFW",
          "https://gateway.pinata.cloud/ipfs/QmZarW8QiTKGCYVEL6gLBAw61nHDPNqS24K7a7aCKSAhQe",
          "https://gateway.pinata.cloud/ipfs/QmUV4wJcRRKozFUHcfvqZUuFmLQjhJVojHm8BhuJ2JBUZF",
          "https://gateway.pinata.cloud/ipfs/QmbpTr4DhrWPKhGWqjearMeT4nXzMvMMLoWUeNRUSPG9U8",
          "https://gateway.pinata.cloud/ipfs/QmV9YgGjy9VrRLv5mkAZBfrEKYxF6xBJSJZvNk9j9v9rHS",
          "https://gateway.pinata.cloud/ipfs/QmXKPy7yenooSnjKTEnXEZHgtkn5stnLcLHvtYpzr8eDxG",
          "https://gateway.pinata.cloud/ipfs/Qmd62iJ9TVga68MzFHw59q38Q5UvLDSsTuNGYgKUFNmD8K",
          "https://gateway.pinata.cloud/ipfs/QmecZfSwGunh5p2SiLyEkmrnciB8upzsFEp9RCR5rLYE7D",
          "https://gateway.pinata.cloud/ipfs/QmbE4GyXuia6vjMU9TML5kHDjupTo6sXFhDpeozTNKDjSP",
          "https://gateway.pinata.cloud/ipfs/QmYsro9qrQpzrYGiqUrb7qJ4PEn3p24EvRbGNhjdvVRXr7",
          "https://gateway.pinata.cloud/ipfs/QmVUyndn8bbhjvTLQFWJebxAQHCh7EAEiGnxad92ZogTV5",
          "https://gateway.pinata.cloud/ipfs/QmZjKp4ae4BfGcrizVgpocboLzMLKnPKXzzd9QwhyCW2BU",
          "https://gateway.pinata.cloud/ipfs/QmXChDb4suqc9datp1sbD9KqE5fRFh9DuPTF7Pf9yXncoh",
          "https://gateway.pinata.cloud/ipfs/Qmbev9sBd8RbgfJjZ42Tk2wFsgkGBVUyemxZe9vfkSK5B4",
          "https://gateway.pinata.cloud/ipfs/Qmcb88acqQU7mgh5reVnqC4AiWeiutXWnHiDGCzxwPsheo",
          "https://gateway.pinata.cloud/ipfs/QmNfy583yfDTLC1nG3KEvthNPuoGc5QRtq1EMgE1njcmxD",
          "https://gateway.pinata.cloud/ipfs/QmX4R6s2Fyf7tmaESxfZHnZo1CWo7EtepPbSxm1BMHKzct",
          "https://gateway.pinata.cloud/ipfs/QmWkjS1j5P3cnodnnH7PzWX7HeMfhjc74Qu1TTC9odNL6R",
          "https://gateway.pinata.cloud/ipfs/QmWUFoV5rwarYu5qgzqyg5vEU9jF2FsocaFbF8uG5vmnZ1",
          "https://gateway.pinata.cloud/ipfs/QmZ1CAbHC39e2dhHXF8rq1GqnoF1UNJCPDTZ8UGhPs6sYS",
        ];

        const loadedImages = await Promise.all(
          urls.map(async (url) => {
            const data = await fetchJson(url);
            return { name: data.name, img_url: data.img_url };
          })
        );

        setImages(loadedImages);
      } catch (error) {
        console.error("Error loading images:", error);
      }
    }

    loadImages();
  }, []);

  const fetchJson = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching JSON:", error);
    }
  };

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
          {images && images.length > 0 && (
            <NftCollection
              title="NFT Rewards"
              description="Awarding students with NFTs can be a unique and innovative way to recognize their achievements and milestones. By leveraging blockchain technology, each NFT represents a digital certificate of accomplishment, providing students with a tangible and verifiable proof of their success."
              image={images[0]}
            />
          )}
        </Box>
      )}

      <Grid container justifyContent="center" spacing={4}>
        {images.map((imageData, index) => (
          <Grid key={index} item>
            <Card style={cardStyle}>
              <CardMedia
                style={mediaStyle}
                component="img"
                src={imageData.img_url}
                title={imageData.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {imageData.name}
                </Typography>
              </CardContent>
              <CardActions>
                <Box flexGrow={1}></Box>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  sx={{ fontSize: "0.8rem" }}
                  onClick={() => handleBuyClick(imageData)}
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

const NftCollection = ({ title, description, image }) => {
  const paperStyle = {
    padding: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "80%",
    height: "200px",
    background: "linear-gradient(to right, darkmagenta, palevioletred)",
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
      <img src={image.img_url} alt={title} style={imageStyle} />{" "}
      {/* Use image.img_url */}
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
  if (!image) return null; // Return null if image is null or undefined

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Buy NFT</DialogTitle>
      <DialogContent>
        <DialogContent>
          <Box display="flex">
            <img
              src={image.img_url}
              alt=""
              style={{ width: "50%", height: "auto", marginRight: "16px" }}
            />
            <DialogContentText>
              {/* Placeholder metadata */}
              Title: {image.name}
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

