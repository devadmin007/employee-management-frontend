import React from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
} from "@mui/material";

const CommonDeleteModal = ({ onClose, open, isLoading, onClick }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent sx={{ height: "90px" }}>
        <DialogContentText
          id="alert-dialog-description"
          sx={{ width: "400px", mx: 2, my: 1, fontSize: "18px" }}
        >
          <Typography variant="h6" color="#000000">
            Are you sure? you want to delete.
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ fontSize: "16px", color: "black" }}>
          No
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          onClick={onClick}
          sx={{
            fontSize: "16px",
            background:
              "linear-gradient(90deg, rgb(239, 131, 29) 0%, rgb(245, 134, 55) 27%, rgb(244, 121, 56) 100%)",
            color: "white",
            mx: 2,
          }}
        >
          {isLoading ? <CircularProgress size={20} color="inherit" /> : "Yes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommonDeleteModal;
