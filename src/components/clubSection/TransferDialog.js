import React, { useState } from "react";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  Checkbox,
  Button,
  Dialog,
} from "@mui/material";

function TransferDialog({ open, onClose, filteredMembers }) {
  const [membersToTransfer, setMembersToTransfer] = useState(
    filteredMembers.map((member) => ({
      ...member,
      transfer: !member.paid,
    }))
  );

  const handlePay = () => {
    const membersToBeTransferred = membersToTransfer.filter(
      (member) => member.transfer
    );
    console.log(membersToBeTransferred);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <div>
        <TransferTable
          filteredMembers={filteredMembers}
          setMembersToTransfer={setMembersToTransfer}
        />
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handlePay}>Pay</Button>
      </div>
    </Dialog>
  );
}

export default TransferDialog;

function TransferTable({ filteredMembers, setMembersToTransfer }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Transfer</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {filteredMembers.map((member) => (
          <TransferRow
            key={member.name}
            member={member}
            setMembersToTransfer={setMembersToTransfer}
          />
        ))}
      </TableBody>
    </Table>
  );
}

function TransferRow({ member, setMembersToTransfer }) {
  const [transfer, setTransfer] = useState(!member.paid); // Checked if not paid

  const handleTransferChange = (event) => {
    const shouldTransfer = event.target.checked;
    setTransfer(shouldTransfer);

    setMembersToTransfer((prev) =>
      prev.map((m) =>
        m.id === member.id ? { ...m, transfer: shouldTransfer } : m
      )
    );
  };

  return (
    <TableRow key={member.name}>
      <TableCell>{member.name}</TableCell>
      <TableCell>
        <Checkbox checked={transfer} onChange={handleTransferChange} />
      </TableCell>
    </TableRow>
  );
}
