import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  tableCellClasses,
  Typography,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";

const classes = [
  { name: "Adult Soccer", size: 12 },
  { name: "Youth Basketball", size: 18 },
  { name: "Senior Swimming", size: 8 },
  { name: "Women's Volleyball", size: 15 },
  { name: "Men's Tennis", size: 10 },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: "white",
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const ClassTable = () => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead
          sx={{
            background: "linear-gradient(45deg, #673ab7 30%, #3f51b5 90%)",
          }}
        >
          <TableRow>
            <StyledTableCell>Class</StyledTableCell>
            <StyledTableCell align="right">Next Event</StyledTableCell>
            <StyledTableCell align="right">Class Size</StyledTableCell>
            <StyledTableCell align="right">Edit</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {classes.map((item, index) => (
            <TableRow
              key={index}
              sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
            >
              <TableCell component="th" scope="row">
                {item.name}
              </TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right">
                <Typography
                  variant="h6"
                  component="div"
                  color="secondary"
                  sx={{ fontWeight: "bold" }}
                >
                  {item.size}
                </Typography>
              </TableCell>

              <TableCell align="right">
                <IconButton>
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClassTable;
