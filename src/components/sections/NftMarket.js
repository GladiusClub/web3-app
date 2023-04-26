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
} from "@mui/material";

export default function NftMarket() {
  const [images, setImages] = useState([]);

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
      <Grid container justifyContent="center" spacing={4}>
        {images.map((image, index) => (
          <Grid key={index} item>
            <Card style={cardStyle}>
              <CardMedia
                style={mediaStyle}
                component="img"
                src={image}
                title={`Image ${index + 1}`}
                objectFit="contain"
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Image {index + 1}
                </Typography>
              </CardContent>
              <CardActions>
                <Box flexGrow={1}></Box>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  sx={{ fontSize: "0.8rem" }}
                >
                  Buy
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
