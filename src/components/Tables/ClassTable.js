import React, { useEffect, useState } from "react";

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
import { useClub } from "../contexts/clubContext";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: "white",
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const ClassTable = ({ clubGroups }) => {
  const { clubs, getAllGroupNames } = useClub();
  const [groupNames, setGroupNames] = useState([]);

  useEffect(() => {
    // Assume clubId is known
    const clubId = "1";
    getAllGroupNames(clubId)
      .then((names) => {
        setGroupNames(names);
      })
      .catch((err) => {
        console.error("Error fetching group names:", err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubs]);
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
          {groupNames.map((groupName, index) => (
            <TableRow
              key={index}
              sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
            >
              <TableCell component="th" scope="row">
                {groupName}
              </TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right">
                <Typography
                  variant="h6"
                  component="div"
                  color="secondary"
                  sx={{ fontWeight: "bold" }}
                >
                  {/* Show class size if available */}
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
