import React from "react";
import { Dialog, Button } from "@mui/material";

function TransferDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <div>
        {/* Content for transfer view goes here. Right now, it's just a close button */}
        <Button onClick={onClose}>Close</Button>
      </div>
    </Dialog>
  );
}

export default TransferDialog;
