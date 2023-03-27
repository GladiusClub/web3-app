import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { Link, useLocation } from "react-router-dom";

const pages = ["Products", "Pricing", "Blog"];

export default function TopBar() {
  const location = useLocation();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ background: "linear-gradient(to right, #1c2b4b, #9b1aff)" }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ marginRight: "20px" }}>
            GLADIUS
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            {pages.map((page) => (
              <MenuItem key={page}>
                <Typography textAlign="center">{page}</Typography>
              </MenuItem>
            ))}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            {location.pathname === "/signup" ? (
              <Link
                to="/login"
                style={{ textDecoration: "none", color: "#8A2BE2" }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ marginLeft: "10px" }}
                >
                  Login
                </Button>
              </Link>
            ) : (
              <Link
                to="/signup"
                style={{ textDecoration: "none", color: "#8A2BE2" }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ marginLeft: "10px" }}
                >
                  Sign Up
                </Button>
              </Link>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
