import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import React from "react";

const InformAlert = ({ open, message, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Typography fontSize={18} fontWeight="bold">
          Alert
        </Typography>
      </ DialogTitle>

      <DialogContent>
        <Typography fontSize={15}>{message}</Typography>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{ textTransform: "none" }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InformAlert;
