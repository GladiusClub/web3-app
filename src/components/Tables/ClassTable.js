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
  IconButton,
  MenuItem,
  Menu,
} from "@mui/material";
import { styled } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";
import { useClub } from "../contexts/clubContext";
import MembersDialog from "../clubSection/groups/MembersDialog";

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
  const { clubs, getAllGroupNames, deleteGroup, getGroupData } = useClub();
  const [groups, setGroups] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);

  const handleMembersDialogOpen = () => {
    setIsMembersDialogOpen(true);
  };

  const handleMembersDialogClose = () => {
    setIsMembersDialogOpen(false);
  };

  const fetchGroupData = () => {
    if (clubs[0]) {
      const clubId = clubs[0].id;
      getAllGroupNames(clubId)
        .then((groupData) => {
          setGroups(groupData);
        })
        .catch((err) => {
          console.error("Error fetching group names:", err);
        });
    }
  };

  const handleClick = (event, group) => {
    setAnchorEl(event.currentTarget);
    setSelectedGroup(group);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    fetchGroupData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubs]);

  return (
    <TableContainer sx={{ maxWidth: 400 }} component={Paper}>
      <Table sx={{ maxWidth: 400 }} aria-label="simple table">
        <TableHead
          sx={{
            background: "linear-gradient(45deg, #673ab7 30%, #3f51b5 90%)",
          }}
        >
          <TableRow>
            <StyledTableCell>Class</StyledTableCell>
            <StyledTableCell align="right">Edit</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groups.map((group, index) => (
            <TableRow
              key={index}
              sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
            >
              <TableCell component="th" scope="row">
                {group.name}
              </TableCell>

              <TableCell align="right">
                <IconButton onClick={(event) => handleClick(event, group)}>
                  <EditIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                >
                  <MenuItem
                    onClick={() => {
                      getGroupData(clubs[0].id, selectedGroup.id)
                        .then((groupData) =>
                          console.log("Group Data:", groupData)
                        )
                        .catch((error) =>
                          console.error("Error fetching group data:", error)
                        );
                    }}
                  >
                    Add/Remove Events
                  </MenuItem>

                  <MenuItem onClick={handleMembersDialogOpen}>
                    Add/Remove Members
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      deleteGroup(clubs[0].id, selectedGroup.id)
                        .then(() => {
                          console.log(
                            `Group ${selectedGroup.id} deleted successfully`
                          );
                          fetchGroupData();
                        })
                        .catch((err) =>
                          console.error("Error deleting group:", err)
                        );
                    }}
                  >
                    Delete Group
                  </MenuItem>
                </Menu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <MembersDialog
        isOpen={isMembersDialogOpen}
        handleClose={handleMembersDialogClose}
        selectedGroup={selectedGroup}
      />
    </TableContainer>
  );
};

export default ClassTable;
