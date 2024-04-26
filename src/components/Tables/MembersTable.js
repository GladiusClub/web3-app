import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  tableCellClasses,
} from "@mui/material";
import ShowNftCardButton from "../NftCard";
import { styled } from "@mui/system";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: "white",
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function RoleSelect({ member, onRoleChange }) {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleChange = (newRole) => {
    onRoleChange(member.id, newRole);
    setSelectedRole(null);
  };

  const openRoleChangeDialog = (role) => {
    setSelectedRole(role);
  };

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id={`member-role-label-${member.id}`}></InputLabel>
        <Select
          labelId={`member-role-label-${member.id}`}
          value={member.role}
          onChange={(event) => openRoleChangeDialog(event.target.value)}
        >
          <MenuItem value="coach">Coach</MenuItem>
          <MenuItem value="athlete">Athlete</MenuItem>
          <MenuItem value="parent">Parent</MenuItem>
          <MenuItem value="owner">Owner</MenuItem>
        </Select>
      </FormControl>
      <RoleChangeDialog
        open={selectedRole !== null}
        selectedRole={selectedRole}
        onClose={() => setSelectedRole(null)}
        onConfirm={handleRoleChange}
      />
    </>
  );
}

function RoleChangeDialog({ open, selectedRole, onClose, onConfirm }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Change Role?"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to change the member's role to {selectedRole}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => onConfirm(selectedRole)}
          color="primary"
          autoFocus
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function MemberRow({ member, onRoleChange }) {
  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {member.name}
      </TableCell>
      <TableCell>{member.email}</TableCell>
      <TableCell>{member.nftsEarned}</TableCell>
      <TableCell>
        <RoleSelect member={member} onRoleChange={onRoleChange} />
      </TableCell>
      <TableCell>
        <ShowNftCardButton member={member} />
      </TableCell>
    </TableRow>
  );
}

export default function MembersTable({ members, value, onRoleChange }) {
  return (
    <TableContainer component={Paper} sx={{ minWidth: 300 }}>
      <Table aria-label="simple table">
        <TableHead
          sx={{
            background: "linear-gradient(45deg, #673ab7 30%, #3f51b5 90%)",
          }}
        >
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Email</StyledTableCell>
            <StyledTableCell>NFTs Earned</StyledTableCell>
            <StyledTableCell>Role</StyledTableCell>
            <StyledTableCell>Transaction</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {members &&
            members
              .filter((member) => {
                switch (value) {
                  case 0:
                    return true;
                  case 1:
                    return member.role === "coach";
                  case 2:
                    return member.role === "athlete";
                  case 3:
                    return member.role === "parent";
                  case 4:
                    return member.role === "owner";
                  default:
                    return true;
                }
              })
              .map((member, index) => (
                <MemberRow
                  key={index}
                  member={member}
                  onRoleChange={onRoleChange}
                />
              ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
