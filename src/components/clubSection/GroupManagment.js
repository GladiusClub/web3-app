import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

const classes = [
  "Adult Soccer",
  "Youth Basketball",
  "Senior Swimming",
  "Women's Volleyball",
  "Men's Tennis",
];

export default function ClassTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Class</TableCell>
            <TableCell align="right">Students</TableCell>
            <TableCell align="right">Events</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {classes.map((item, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {item}
              </TableCell>
              <TableCell align="right">
                <Button variant="outlined">View Members</Button>
              </TableCell>
              <TableCell align="right">
                <Button variant="outlined">View Events</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
