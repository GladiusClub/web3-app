import React, { useState } from "react";
import { Button } from "@mui/material";
import ClassTable from "../../Tables/ClassTable";
import AddClassDialog from "./AddClassDialog";

export default function ClassDetails({ clubGroups }) {
  const [openDialog, setOpenDialog] = useState(false); // State for dialog visibility

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div>
      <Button
        color="secondary"
        variant="contained"
        sx={{ marginBottom: 2 }}
        onClick={handleOpenDialog}
      >
        Add Class +
      </Button>
      <ClassTable clubGroups={clubGroups}></ClassTable>
      <AddClassDialog open={openDialog} handleClose={handleCloseDialog} />
    </div>
  );
}
